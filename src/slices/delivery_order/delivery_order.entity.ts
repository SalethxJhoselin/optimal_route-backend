import { DeliveryOrderState } from 'src/enums/delivery_order.enum';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryVehicle } from '../delivery_vehicle/delivery_vehicle';
import { Order } from '../order/order.entity';

@Entity('delivery_order')
export class DeliveryOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DeliveryOrderState,
    default: DeliveryOrderState.ASSIGNED
  })
  delivery_state: DeliveryOrderState;

  @ManyToOne(() => Order, order => order.deliveryOrders, { nullable: false })
  order: Order;

  @ManyToOne(() => DeliveryVehicle, dv => dv.deliveryOrders, { nullable: false })
  deliveryVehicle: DeliveryVehicle;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
