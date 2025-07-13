import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './slices/auth/auth.module';
import { DeliveryOrderModule } from './slices/delivery_order/delivery_order.module';
import { DeliveryVehicleModule } from './slices/delivery_vehicle/delivery_vehicle.module';
import { OrderModule } from './slices/order/order.module';
import { PaymentModule } from './slices/payment/payment.module';
import { UserModule } from './slices/user/user.module';
import { StripeModule } from './slices/stripe/stripe.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    DeliveryVehicleModule,
    DeliveryOrderModule,
    OrderModule,
    PaymentModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
