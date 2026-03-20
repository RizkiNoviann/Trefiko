import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMenuDto) {
    const menu = await this.prisma.menu.create({
      data: {
        ...dto,
        price: dto.price,
      },
    });

    return {
      message: 'Menu created',
      menu: this.serializeMenu(menu),
    };
  }

  async findAll() {
    const menus = await this.prisma.menu.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Menus fetched',
      menus: menus.map((menu) => this.serializeMenu(menu)),
    };
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return {
      message: 'Menu fetched',
      menu: this.serializeMenu(menu),
    };
  }

  async update(id: string, dto: UpdateMenuDto) {
    await this.assertExists(id);

    const menu = await this.prisma.menu.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return {
      message: 'Menu updated',
      menu: this.serializeMenu(menu),
    };
  }

  async remove(id: string) {
    await this.assertExists(id);

    await this.prisma.menu.delete({
      where: { id },
    });

    return {
      message: 'Menu deleted',
    };
  }

  private async assertExists(id: string) {
    const existing = await this.prisma.menu.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Menu not found');
    }
  }

  private serializeMenu(menu: {
    id: string;
    image: string;
    title: string;
    description: string;
    category: 'COFFEE' | 'NON_COFFEE' | 'SNACK';
    price: any;
    status: boolean;
    favorite: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...menu,
      price: Number(menu.price),
    };
  }
}
