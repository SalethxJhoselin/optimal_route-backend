import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  capture_time: Date;

  @OneToMany(() => Order, order => order.location)
  orders: Order[];
}
