import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from '../location/location.module';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        LocationModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService],
})
export class OrderModule { }
