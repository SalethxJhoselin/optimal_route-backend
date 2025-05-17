import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { DeliveryVehicleController } from './delivery_vehicle.controller';
import { DeliveryVehicle } from './delivery_vehicle.entity';
import { DeliveryVehicleService } from './delivery_vehicle.service';

@Module({
    imports: [TypeOrmModule.forFeature([DeliveryVehicle, User])],
    providers: [DeliveryVehicleService],
    controllers: [DeliveryVehicleController],
})
export class DeliveryVehicleModule { }
