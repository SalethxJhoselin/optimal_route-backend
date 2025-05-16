import { VehicleType } from 'src/enums/delivery_vehicle.enum';
import { VehicleState } from 'src/enums/vehicle_state.enum';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryOrder } from '../delivery_order/delivery_order.entity';
import { User } from '../user/user.entity';

@Entity('delivery_vehicle')
export class DeliveryVehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  license_plate: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type_vehicle: VehicleType;

  @Column('float')
  capacity: number;

  @Column({
    type: 'enum',
    enum: VehicleState,
    default: VehicleState.OPERATIONAL
  })
  state: VehicleState;

  @ManyToOne(() => User, user => user.deliveryVehicles, { nullable: false })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DeliveryOrder, dor => dor.deliveryVehicle)
  deliveryOrders: DeliveryOrder[];
}
