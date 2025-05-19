import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './payment.dto';

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
