import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string, dto: CreateOrderDto) {
    const menuIds = dto.items.map((item) => item.menuId);
    const menus = await this.prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        status: true,
      },
    });

    if (menus.length !== menuIds.length) {
      throw new BadRequestException('Some selected menu items are unavailable');
    }

    const menuMap = new Map(menus.map((menu) => [menu.id, menu]));

    const normalizedItems = dto.items.map((item) => {
      const menu = menuMap.get(item.menuId);

      if (!menu) {
        throw new BadRequestException('Some selected menu items are unavailable');
      }

      const unitPrice = Number(menu.price);
      const lineTotal = unitPrice * item.quantity;

      return {
        menuId: item.menuId,
        quantity: item.quantity,
        temperature: item.temperature,
        unitPrice,
        lineTotal,
      };
    });

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );

    const orderCode = await this.generateOrderCode();

    const order = await this.prisma.order.create({
      data: {
        code: orderCode,
        userId,
        payment: dto.payment,
        note: dto.note?.trim() || null,
        totalAmount,
        status: 'PENDING',
        items: {
          create: normalizedItems.map((item) => ({
            menuId: item.menuId,
            quantity: item.quantity,
            temperature: item.temperature,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: this.orderInclude,
    });

    return {
      message: 'Checkout success. Waiting for admin confirmation',
      order: this.serializeOrder(order),
    };
  }

  async getMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        hiddenByUser: false,
        status: { in: ['PROCESS', 'COMPLETED'] },
      },
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Orders fetched',
      orders: orders.map((order) => this.serializeUserOrder(order)),
    };
  }

  async getAdminOrders(status?: 'PENDING' | 'PROCESS' | 'COMPLETED') {
    const orders = await this.prisma.order.findMany({
      where: status ? { status } : undefined,
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Admin orders fetched',
      orders: orders.map((order) => this.serializeOrder(order)),
    };
  }

  async acceptOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only pending order can be accepted');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: 'PROCESS' },
      include: this.orderInclude,
    });

    return {
      message: 'Order accepted',
      order: this.serializeOrder(updated),
    };
  }

  async completeOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PROCESS') {
      throw new BadRequestException('Only processed order can be completed');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: this.orderInclude,
    });

    return {
      message: 'Order completed',
      order: this.serializeOrder(updated),
    };
  }

  async hideMyCompletedOrder(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      select: { id: true, status: true, hiddenByUser: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Only completed order can be hidden');
    }

    if (order.hiddenByUser) {
      return { message: 'Order already hidden' };
    }

    await this.prisma.order.update({
      where: { id },
      data: { hiddenByUser: true },
    });

    return { message: 'Order hidden from your history' };
  }

  async deleteCompletedOrderByAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Only completed order can be deleted permanently',
      );
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted permanently' };
  }

  private async generateOrderCode(): Promise<string> {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const datePart = `${day}${month}`;

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const totalToday = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = totalToday + 1;

    return `TRF-${datePart}-${sequence}`;
  }

  private readonly orderInclude = {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    items: {
      include: {
        menu: true,
      },
    },
  } as const;

  private serializeOrder(order: {
    id: string;
    code: string;
    userId: string;
    payment: 'COD' | 'DIRECT';
    status: 'PENDING' | 'PROCESS' | 'COMPLETED';
    note: string | null;
    hiddenByUser: boolean;
    totalAmount: Decimal;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      menuId: string;
      quantity: number;
      temperature: string | null;
      unitPrice: Decimal;
      lineTotal: Decimal;
      menu: {
        id: string;
        image: string;
        title: string;
        description: string;
        category: 'COFFEE' | 'NON_COFFEE' | 'SNACK';
        price: Decimal;
        status: boolean;
        favorite: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }>;
  }) {
    return {
      id: order.id,
      code: order.code,
      userId: order.userId,
      user: order.user,
      payment: order.payment,
      status: order.status,
      note: order.note,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        id: item.id,
        menuId: item.menuId,
        quantity: item.quantity,
        temperature: item.temperature,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
        menu: {
          ...item.menu,
          price: Number(item.menu.price),
        },
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private serializeUserOrder(order: {
    id: string;
    code: string;
    userId: string;
    payment: 'COD' | 'DIRECT';
    status: 'PENDING' | 'PROCESS' | 'COMPLETED';
    note: string | null;
    hiddenByUser: boolean;
    totalAmount: Decimal;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      menuId: string;
      quantity: number;
      temperature: string | null;
      unitPrice: Decimal;
      lineTotal: Decimal;
      menu: {
        id: string;
        image: string;
        title: string;
        description: string;
        category: 'COFFEE' | 'NON_COFFEE' | 'SNACK';
        price: Decimal;
        status: boolean;
        favorite: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }>;
  }) {
    const serialized = this.serializeOrder(order);

    return {
      ...serialized,
      userStatus: serialized.status === 'COMPLETED' ? 'COMPLETED' : 'PROCESS',
    };
  }
}
