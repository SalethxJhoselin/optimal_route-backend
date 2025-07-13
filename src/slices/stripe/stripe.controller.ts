// src/stripe/stripe.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('movil')
  async pagarStripeMovil(@Body() body: { amount: number; currency: string }) {
    const clientSecret = await this.stripeService.createMobilePaymentIntent(body.amount, body.currency);
    return { clientSecret };
  }

  @Get('verificar/:session_id')
  async verificar(@Param('session_id') session_id: string) {
    const status = await this.stripeService.verifySession(session_id);
    const mensaje =
      status === 'paid'
        ? 'El pago fue exitoso'
        : 'El pago no fue completado o está pendiente';
    return { message: mensaje };
  }
}
