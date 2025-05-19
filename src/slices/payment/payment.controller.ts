import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './payment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Ruta para registrar un nuevo pago
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  // Ruta para ver todos los pagos (opcional, útil para pruebas)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }
}
