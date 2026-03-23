import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user!.sub, dto);
  }

  @Get('public')
  listPublic(@Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    const parsedLimit = Number(limit);
    return this.reviewsService.listPublic(cursor, parsedLimit);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  listAdmin() {
    return this.reviewsService.listAdmin();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  removeByAdmin(@Param('id') id: string) {
    return this.reviewsService.removeByAdmin(id);
  }
}
