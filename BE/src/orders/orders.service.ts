import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly midtransServerKey = process.env.MIDTRANS_SERVER_KEY || '';

  private readonly midtransApiBaseUrl =
    process.env.MIDTRANS_API_BASE_URL || 'https://api.sandbox.midtrans.com';

  private readonly midtransSnapBaseUrl =
    process.env.MIDTRANS_SNAP_BASE_URL || 'https://app.sandbox.midtrans.com';

  private readonly midtransSettledStatuses = new Set(['settlement', 'capture']);

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

    const order = await this.createOrderWithUniqueCode(
      userId,
      dto,
      normalizedItems,
      totalAmount,
    );

    if (dto.payment === 'DIRECT') {
      const snapTransaction = await this.createMidtransSnapTransaction(order);

      return {
        message: 'Checkout success. Complete direct payment first',
        order: this.serializeOrder(order),
        snapToken: snapTransaction.token,
        snapRedirectUrl: snapTransaction.redirect_url,
      };
    }

    return {
      message: 'Checkout success. Waiting for admin confirmation',
      order: this.serializeOrder(order),
    };
  }

  async confirmDirectPayment(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: this.orderInclude,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment !== 'DIRECT') {
      throw new BadRequestException('Order is not using direct payment');
    }

    if (order.status === 'PROCESS' || order.status === 'COMPLETED') {
      return {
        message: 'Order already paid and processed',
        order: this.serializeOrder(order),
      };
    }

    const paymentStatus = await this.fetchMidtransTransactionStatus(order.code);
    const transactionStatus = paymentStatus.transaction_status;
    const fraudStatus = paymentStatus.fraud_status;
    const isPaid =
      this.midtransSettledStatuses.has(transactionStatus) &&
      (transactionStatus !== 'capture' || fraudStatus !== 'challenge');

    if (!isPaid) {
      throw new BadRequestException(
        `Direct payment not completed yet (${transactionStatus})`,
      );
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESS',
        paymentType: paymentStatus.payment_type || null,
        paymentChannel: this.resolvePaymentChannel(paymentStatus),
      },
      include: this.orderInclude,
    });

    return {
      message: 'Direct payment confirmed. Order moved to process',
      order: this.serializeOrder(updated),
    };
  }

  async getMyOrders(
    userId: string,
    status?: 'PENDING' | 'PROCESS' | 'COMPLETED',
  ) {
    const where: Prisma.OrderWhereInput = {
      userId,
      hiddenByUser: false,
      status: status ? status : { in: ['PENDING', 'PROCESS', 'COMPLETED'] },
    };

    const orders = await this.prisma.order.findMany({
      where,
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Orders fetched',
      orders: orders.map((order) => this.serializeUserOrder(order)),
    };
  }

  async getAdminOrders(status?: 'PENDING' | 'PROCESS' | 'COMPLETED') {
    const where: Prisma.OrderWhereInput = status
      ? status === 'PENDING'
        ? { status: 'PENDING' as const, payment: 'COD' as const }
        : { status }
      : {
          OR: [
            { status: { in: ['PROCESS', 'COMPLETED'] } },
            { status: 'PENDING' as const, payment: 'COD' as const },
          ],
        };

    const orders = await this.prisma.order.findMany({
      where,
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

  private async createOrderWithUniqueCode(
    userId: string,
    dto: CreateOrderDto,
    normalizedItems: Array<{
      menuId: string;
      quantity: number;
      temperature: 'hot' | 'iced' | undefined;
      unitPrice: number;
      lineTotal: number;
    }>,
    totalAmount: number,
  ) {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const orderCode = this.generateOrderCode();

      try {
        return await this.prisma.order.create({
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
      } catch (error) {
        const isCodeConflict =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          Array.isArray(error.meta?.target) &&
          error.meta.target.includes('code');

        if (!isCodeConflict || attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }

    throw new BadRequestException('Failed to generate unique order code');
  }

  private generateOrderCode(): string {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const randomPart = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();

    return `TRF-${year}${month}${day}-${hours}${minutes}${seconds}-${randomPart}`;
  }

  private async createMidtransSnapTransaction(order: {
    code: string;
    totalAmount: Decimal;
    user: {
      name: string;
      email: string;
    };
  }) {
    const payload = {
      transaction_details: {
        order_id: order.code,
        gross_amount: Math.round(Number(order.totalAmount)),
      },
      customer_details: {
        first_name: order.user.name,
        email: order.user.email,
      },
    };

    const response = await fetch(`${this.midtransSnapBaseUrl}/snap/v1/transactions`, {
      method: 'POST',
      headers: this.getMidtransHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(
        `Midtrans snap error: ${response.status} ${errorText}`,
      );
    }

    return (await response.json()) as {
      token: string;
      redirect_url: string;
    };
  }

  private async fetchMidtransTransactionStatus(orderCode: string) {
    const response = await fetch(
      `${this.midtransApiBaseUrl}/v2/${encodeURIComponent(orderCode)}/status`,
      {
        method: 'GET',
        headers: this.getMidtransHeaders(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(
        `Failed to verify Midtrans payment: ${response.status} ${errorText}`,
      );
    }

    return (await response.json()) as {
      transaction_status: string;
      fraud_status?: string;
      payment_type?: string;
      va_numbers?: Array<{ bank?: string; va_number?: string }>;
      permata_va_number?: string;
      biller_code?: string;
      bill_key?: string;
      store?: string;
    };
  }

  private resolvePaymentChannel(paymentStatus: {
    payment_type?: string;
    va_numbers?: Array<{ bank?: string; va_number?: string }>;
    permata_va_number?: string;
    biller_code?: string;
    bill_key?: string;
    store?: string;
  }) {
    if (paymentStatus.va_numbers?.length) {
      const firstVa = paymentStatus.va_numbers[0];
      if (firstVa?.bank) {
        return `${firstVa.bank.toUpperCase()} VA`;
      }
    }

    if (paymentStatus.permata_va_number) {
      return 'PERMATA VA';
    }

    if (paymentStatus.biller_code && paymentStatus.bill_key) {
      return 'Mandiri Bill Payment';
    }

    if (paymentStatus.store) {
      return paymentStatus.store.toUpperCase();
    }

    if (paymentStatus.payment_type) {
      return paymentStatus.payment_type.replace(/_/g, ' ').toUpperCase();
    }

    return null;
  }

  private getMidtransHeaders() {
    if (!this.midtransServerKey) {
      throw new BadRequestException('Midtrans server key belum dikonfigurasi');
    }

    const authToken = Buffer.from(`${this.midtransServerKey}:`).toString('base64');

    return {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
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
    paymentType: string | null;
    paymentChannel: string | null;
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
      paymentType: order.paymentType,
      paymentChannel: order.paymentChannel,
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
    paymentType: string | null;
    paymentChannel: string | null;
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
      userStatus: serialized.status,
    };
  }
}
