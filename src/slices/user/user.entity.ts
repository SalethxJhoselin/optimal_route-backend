import { IsUUID } from 'class-validator';
import { UserWorkStatus } from 'src/enums/user_state.enum';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryVehicle } from '../delivery_vehicle/delivery_vehicle.entity';
import { Role } from '../role/role.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phone_number: number;

    @Column({
        type: 'enum',
        enum: UserWorkStatus,
        default: UserWorkStatus.AVAILABLE
    })
    state: UserWorkStatus;

    @ManyToOne(() => Role, role => role.users, { nullable: false })
    role: Role;

    @OneToMany(() => DeliveryVehicle, dv => dv.user)
    deliveryVehicles: DeliveryVehicle[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
