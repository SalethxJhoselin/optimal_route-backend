import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderState } from 'src/enums/order_state.enum';
import { VehicleState } from 'src/enums/vehicle_state.enum';
import { getDistanceFromLatLonInKm } from 'src/utils/distance.util';
import { Repository } from 'typeorm';
import { Order } from '../order/order.entity';
import { OrderService } from '../order/order.service';
import { User } from '../user/user.entity';
import { CreateDeliveryVehicleDto, UpdateDeliveryVehicleDto } from './delivery_vehicle.dto';
import { DeliveryVehicle } from './delivery_vehicle.entity';

@Injectable()
export class DeliveryVehicleService {
    constructor(
        @InjectRepository(DeliveryVehicle)
        private vehicleRepo: Repository<DeliveryVehicle>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        private readonly orderService: OrderService,
    ) { }

    async findAll(): Promise<DeliveryVehicle[]> {
        return this.vehicleRepo.find({ relations: ['user'] });
    }

    async findOne(id: string): Promise<DeliveryVehicle> {
        const vehicle = await this.vehicleRepo.findOne({ where: { id }, relations: ['user'] });
        if (!vehicle) throw new NotFoundException(`DeliveryVehicle with id ${id} not found`);
        return vehicle;
    }

    async create(dto: CreateDeliveryVehicleDto): Promise<DeliveryVehicle> {
        const user = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!user) throw new NotFoundException(`User with id ${dto.userId} not found`);

        const vehicle = this.vehicleRepo.create({
            license_plate: dto.license_plate,
            type_vehicle: dto.type_vehicle,
            capacity: dto.capacity,
            user,
        });

        return this.vehicleRepo.save(vehicle);
    }

    async update(id: string, dto: UpdateDeliveryVehicleDto): Promise<DeliveryVehicle> {
        const vehicle = await this.findOne(id);

        if (dto.userId) {
            const user = await this.userRepo.findOne({ where: { id: dto.userId } });
            if (!user) throw new NotFoundException(`User with id ${dto.userId} not found`);
            vehicle.user = user;
        }

        Object.assign(vehicle, dto);
        return this.vehicleRepo.save(vehicle);
    }

    async remove(id: string): Promise<void> {
        const vehicle = await this.findOne(id);
        await this.vehicleRepo.remove(vehicle);
    }

    async setVehicleOperational(userId: string, vehicleId: string): Promise<DeliveryVehicle> {
        // 1. Buscar el vehículo que se quiere activar y validar que pertenezca al usuario
        const vehicleToActivate = await this.vehicleRepo.findOne({ where: { id: vehicleId }, relations: ['user'] });
        if (!vehicleToActivate) throw new NotFoundException(`DeliveryVehicle with id ${vehicleId} not found`);
        if (vehicleToActivate.user.id !== userId) {
            throw new NotFoundException(`El vehículo no pertenece al usuario con id ${userId}`);
        }
        // 2. Obtener todos los vehículos del mismo usuario
        const userVehicles = await this.vehicleRepo.find({ where: { user: { id: userId } } });
        // 3. Actualizar el estado de todos los vehículos del usuario
        const updatePromises = userVehicles.map(v => {
            v.state = (v.id === vehicleId) ? VehicleState.OPERATIONAL : VehicleState.NON_OPERATIONAL;
            return this.vehicleRepo.save(v);
        });
        await Promise.all(updatePromises);
        // 4. Buscar nuevamente el vehículo activado para devolverlo
        const activatedVehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId }, relations: ['user'] });
        if (!activatedVehicle) {
            throw new NotFoundException(`DeliveryVehicle with id ${vehicleId} not found after update`);
        }
        return activatedVehicle;
    }

    async findByUserId(userId: string): Promise<DeliveryVehicle[]> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException(`User with id ${userId} not found`);

        return this.vehicleRepo.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    async receiveLocation(
        deliveryVehicleId: string,
        lat: number,
        lng: number,
    ): Promise<{
        message: string;
        pendingOrders: Order[];
        capacity: number;
    }> {
        const vehicle = await this.vehicleRepo.findOne({
            where: { id: deliveryVehicleId },
            relations: ['user'],
        });

        if (!vehicle) throw new NotFoundException(`Vehicle with id ${deliveryVehicleId} not found`);

        console.log(`Ubicación recibida: Vehículo ${deliveryVehicleId}, lat=${lat}, lng=${lng}`);

        const pendingOrders = await this.orderService['orderRepo'].find({
            where: { state: OrderState.PENDING },
            relations: ['location', 'payments', 'deliveryOrders', 'deliveryOrders.deliveryVehicle'],
        });

        // 1. Calcular distancia desde la movilidad a cada orden
        const ordersWithDistance = pendingOrders.map(order => {
            const orderLat = order.location.latitude;
            const orderLng = order.location.longitude;
            const distance = getDistanceFromLatLonInKm(lat, lng, orderLat, orderLng);
            return { ...order, distance };
        });

        // 2. Ordenar por distancia (más cercana primero)
        ordersWithDistance.sort((a, b) => a.distance - b.distance);

        // 3. Seleccionar solo las órdenes cuya suma de volumen ≤ capacidad
        const selectedOrders: Order[] = [];
        let currentVolume = 0;
        const maxCapacity = vehicle.capacity;

        for (const order of ordersWithDistance) {
            if (currentVolume + order.volume <= maxCapacity) {
                selectedOrders.push(order);
                currentVolume += order.volume;
            } else {
                break; // detener si excede la capacidad
            }
        }

        // 4. Eliminar el campo distance (opcional)
        // const finalOrders = selectedOrders.map(({ distance, ...order }) => order);

        return {
            message: 'Envío exitoso de ubicación',
            pendingOrders: selectedOrders,
            capacity: vehicle.capacity,
        };
    }
}
