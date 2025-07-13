import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import { CreateOrderWithLocationDto, UpdateOrderDto } from './order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        private locationService: LocationService,
    ) { }

    async create(createOrderWithLocationDto: CreateOrderWithLocationDto): Promise<Order> {
        const { order, location } = createOrderWithLocationDto;

        // Si quieres que backend asigne la fecha capture_time, hazlo aquí:
        // location.capture_time = location.capture_time ?? new Date();

        // 1. Crear Location primero
        const createdLocation = await this.locationService.create(location);

        // 2. Crear Order vinculando location creada
        const newOrder = this.orderRepo.create({
            location: createdLocation,
            volume: order.volume,
            total_payable: order.total_payable,
            state: order.state ?? undefined,
        });

        return this.orderRepo.save(newOrder);
    }

    async findAll(): Promise<Order[]> {
        return this.orderRepo.find({ relations: [
            'location', 
            'payments', 
            'deliveryOrders',
            'deliveryOrders.deliveryVehicle',
            'deliveryOrders.deliveryVehicle.user'
        ]});
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepo.findOne({ where: { id }, relations: ['location', 'payments', 'deliveryOrders'] });
        if (!order) throw new NotFoundException(`Order with id ${id} not found`);
        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id);
        // Si viene nueva location para actualizar
        if (updateOrderDto.location) {
            const loc = updateOrderDto.location;

            if (loc.latitude === undefined || loc.longitude === undefined || loc.capture_time === undefined) {
                throw new BadRequestException('Para actualizar location, debe enviar latitude, longitude y capture_time completos.');
            }
            // Crear nueva ubicación con objeto completo
            const newLocation = await this.locationService.create({
                latitude: loc.latitude,
                longitude: loc.longitude,
                capture_time: loc.capture_time,
            });

            order.location = newLocation;
        }

        if (updateOrderDto.volume !== undefined) order.volume = updateOrderDto.volume;
        if (updateOrderDto.total_payable !== undefined) order.total_payable = updateOrderDto.total_payable;
        if (updateOrderDto.state !== undefined) order.state = updateOrderDto.state;
        return this.orderRepo.save(order);
    }

    async delete(id: string): Promise<void> {
        const order = await this.findOne(id);
        await this.orderRepo.remove(order);
    }
    async findAllByUser(userId: string): Promise<Order[]> {
        return this.orderRepo.find(
            { 
                where: { deliveryOrders: { deliveryVehicle: { user: {id: userId } } } }, 
                relations: ['location', 'payments', 'deliveryOrders'] 
            }
        );
    }

    async findOneByUserState(userId: string, state: OrderState): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: {
                deliveryOrders: {
                    deliveryVehicle: {
                        user: { id: userId },
                    },
                },
                state: state,
            },
            relations: ['location', 'payments', 'deliveryOrders'],
        });
        if (!order) throw new NotFoundException(Order for user ${userId} with state ${state} not found);
        return order;
    }

    async findAllByUserState(userId: string, state: Order['state']): Promise<Order[]> {
        return this.orderRepo.find({
            where: {
                deliveryOrders: {
                    deliveryVehicle: {
                        user: { id: userId },
                    },
                },
                state: state,
            },
            relations: ['location', 'payments', 'deliveryOrders'],
        });
    }
}
