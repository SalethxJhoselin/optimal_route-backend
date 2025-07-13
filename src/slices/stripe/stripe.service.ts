// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_PRIVATE_KEY') ?? '');
  }

  async createMobilePaymentIntent(amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent.client_secret;
  }

  async verifySession(session_id: string) {
    const session = await this.stripe.checkout.sessions.retrieve(session_id);
    return session.payment_status;
  }
}
