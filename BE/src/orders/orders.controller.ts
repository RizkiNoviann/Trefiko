import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Req() req: AuthenticatedRequest, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(req.user!.sub, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyOrders(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: 'PENDING' | 'PROCESS' | 'COMPLETED',
  ) {
    return this.ordersService.getMyOrders(req.user!.sub, status);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAdminOrders(@Query('status') status?: 'PENDING' | 'PROCESS' | 'COMPLETED') {
    return this.ordersService.getAdminOrders(status);
  }

  @Patch(':id/accept')
  @UseGuards(JwtAuthGuard, AdminGuard)
  acceptOrder(@Param('id') id: string) {
    return this.ordersService.acceptOrder(id);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  completeOrder(@Param('id') id: string) {
    return this.ordersService.completeOrder(id);
  }

  @Patch(':id/hide')
  @UseGuards(JwtAuthGuard)
  hideMyCompletedOrder(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.ordersService.hideMyCompletedOrder(req.user!.sub, id);
  }

  @Patch(':id/confirm-direct-payment')
  @UseGuards(JwtAuthGuard)
  confirmDirectPayment(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.ordersService.confirmDirectPayment(req.user!.sub, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteCompletedOrderByAdmin(@Param('id') id: string) {
    return this.ordersService.deleteCompletedOrderByAdmin(id);
  }
}
