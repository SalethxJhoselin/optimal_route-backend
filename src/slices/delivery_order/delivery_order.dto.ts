import { IsEnum, IsUUID } from 'class-validator';
import { DeliveryOrderState } from 'src/enums/delivery_order.enum';

export class CreateDeliveryOrderDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  deliveryVehicleId: string;
}

export class UpdateDeliveryOrderStateDto {
  @IsEnum(DeliveryOrderState)
  delivery_state: DeliveryOrderState;
}
