import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 20;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const existingReview = await this.prisma.review.findUnique({
      where: { orderId: dto.orderId },
      select: { id: true },
    });

    if (existingReview) {
      throw new BadRequestException('Pesanan ini sudah memiliki review');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        orderId: dto.orderId,
        rating: dto.rating,
        comment: dto.comment.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'Review berhasil dikirim',
      review: this.serializeReview(review),
    };
  }

  async listPublic(cursor?: string, limit = DEFAULT_LIMIT) {
    const take = this.normalizeLimit(limit);

    const reviews = await this.prisma.review.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const hasMore = reviews.length > take;
    const sliced = hasMore ? reviews.slice(0, take) : reviews;

    return {
      message: 'Reviews fetched',
      reviews: sliced.map((review) => this.serializeReview(review)),
      nextCursor: hasMore ? sliced[sliced.length - 1]?.id ?? null : null,
      hasMore,
    };
  }

  async listAdmin() {
    const reviews = await this.prisma.review.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });

    return {
      message: 'Admin reviews fetched',
      reviews: reviews.map((review) => ({
        ...this.serializeReview(review),
        user: {
          ...review.user,
        },
        order: review.order,
      })),
    };
  }

  async removeByAdmin(id: string) {
    const existing = await this.prisma.review.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Review deleted' };
  }

  private normalizeLimit(limit: number) {
    if (!Number.isFinite(limit)) {
      return DEFAULT_LIMIT;
    }

    return Math.min(Math.max(Math.trunc(limit), 1), MAX_LIMIT);
  }

  private serializeReview(review: {
    id: string;
    userId: string;
    orderId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
    };
  }) {
    return {
      id: review.id,
      userId: review.userId,
      orderId: review.orderId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user,
    };
  }
}
