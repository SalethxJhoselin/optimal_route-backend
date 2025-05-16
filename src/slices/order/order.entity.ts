import { OrderState } from 'src/enums/order_state.enum';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryOrder } from '../delivery_order/delivery_order.entity';
import { Location } from '../location/location.enity';
import { Payment } from '../payment/payment.entity';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Location, location => location.orders, { nullable: false })
    location: Location;

    @OneToMany(() => Payment, payment => payment.order)
    payments: Payment[];

    @Column('float')
    volume: number;

    @Column({
        type: 'enum',
        enum: OrderState,
        default: OrderState.PENDING
    })
    state: OrderState;

    @Column('float')
    total_payable: number;

    @OneToMany(() => DeliveryOrder, dor => dor.order)
    deliveryOrders: DeliveryOrder[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
