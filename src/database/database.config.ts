import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DeliveryOrder } from '../slices/delivery_order/delivery_order.entity';
import { DeliveryVehicle } from '../slices/delivery_vehicle/delivery_vehicle';
import { Location } from '../slices/location/location.enity';
import { Order } from '../slices/order/order.entity';
import { Payment } from '../slices/payment/payment.entity';
import { Role } from '../slices/role/role.entity';
import { User } from '../slices/user/user.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [User, Role, DeliveryVehicle, DeliveryOrder, Location, Order, Payment],
    synchronize: true,
    ssl: { rejectUnauthorized: false },
});
