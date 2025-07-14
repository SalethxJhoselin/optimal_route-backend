import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

import { DeliveryOrderService } from './delivery_order.service';
import {
  CreateDeliveryOrderDto,
  UpdateDeliveryOrderStateDto,
} from './delivery_order.dto';

@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('delivery-orders')
export class DeliveryOrderController {
  constructor(private readonly deliveryOrderService: DeliveryOrderService) {}

  // Crear una nueva entrega
  @Post()
  create(@Body() dto: CreateDeliveryOrderDto) {
    return this.deliveryOrderService.create(dto);
  }

  // Cambiar el estado de una entrega
  @Patch(':id/state')
  updateState(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryOrderStateDto,
  ) {
    return this.deliveryOrderService.updateState(id, dto);
  }

  // Ver todas las entregas
  @Get()
  findAll() {
    return this.deliveryOrderService.findAll();
  }

  // Eliminar una entrega
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.deliveryOrderService.delete(id);
  }
}
