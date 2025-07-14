import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryOrder } from './delivery_order.entity';
import {
  CreateDeliveryOrderDto,
  UpdateDeliveryOrderStateDto,
} from './delivery_order.dto';
import { DeliveryVehicle } from '../delivery_vehicle/delivery_vehicle.entity';
import { Order } from '../order/order.entity';
import { DeliveryOrderState } from 'src/enums/delivery_order.enum';

@Injectable()
export class DeliveryOrderService {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepo: Repository<DeliveryOrder>,

    @InjectRepository(DeliveryVehicle)
    private readonly deliveryVehicleRepo: Repository<DeliveryVehicle>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateDeliveryOrderDto): Promise<DeliveryOrder> {
    const vehicle = await this.deliveryVehicleRepo.findOneBy({
      id: dto.deliveryVehicleId,
    });
    const order = await this.orderRepo.findOneBy({ id: dto.orderId });

    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    if (!order) throw new NotFoundException('Orden no encontrada');

    const deliveryOrder = this.deliveryOrderRepo.create({
      deliveryVehicle: vehicle,
      order: order,
      delivery_state: DeliveryOrderState.ASSIGNED,
    });

    return this.deliveryOrderRepo.save(deliveryOrder);
  }

  async updateState(
    id: string,
    dto: UpdateDeliveryOrderStateDto,
  ): Promise<DeliveryOrder> {
    const deliveryOrder = await this.deliveryOrderRepo.findOneBy({ id });
    if (!deliveryOrder) throw new NotFoundException('Entrega no encontrada');

    deliveryOrder.delivery_state = dto.delivery_state;
    return this.deliveryOrderRepo.save(deliveryOrder);
  }

  async findAll(): Promise<DeliveryOrder[]> {
    return this.deliveryOrderRepo.find();
  }


  async delete(id: string): Promise<void> {
    const deliveryOrder = await this.deliveryOrderRepo.findOneBy({ id });
    if (!deliveryOrder) throw new NotFoundException('Entrega no encontrada');

    await this.deliveryOrderRepo.remove(deliveryOrder);
  }
}
