import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryOrderState } from 'src/enums/delivery_order.enum';

export class CreateDeliveryOrderDto {
  @ApiProperty({
    example: 'b4e1f33e-9dfc-4a4c-96cd-663b3b6e24cb',
    description: 'ID de la orden que se desea asignar',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    example: 'a9e1ff31-1d4c-4f6e-8373-0a1a79c3b12d',
    description: 'ID del vehículo repartidor asignado',
  })
  @IsUUID()
  deliveryVehicleId: string;
}

export class UpdateDeliveryOrderStateDto {
  @ApiProperty({
    enum: DeliveryOrderState,
    example: DeliveryOrderState.IN_TRANSIT,
    description: 'Nuevo estado de la entrega',
  })
  @IsEnum(DeliveryOrderState)
  delivery_state: DeliveryOrderState;
}
