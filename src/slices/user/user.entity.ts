import { UserWorkStatus } from 'src/enums/user_state.enum';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryVehicle } from '../delivery_vehicle/delivery_vehicle';
import { Role } from '../role/role.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

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
