import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { VehicleType } from 'src/enums/delivery_vehicle.enum';
import { VehicleState } from 'src/enums/vehicle_state.enum';

export class CreateDeliveryVehicleDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'ABC1234', description: 'License plate of the vehicle' })
    license_plate: string;

    @IsEnum(VehicleType)
    @ApiProperty({ enum: VehicleType, example: VehicleType.TRUCK, description: 'Type of the vehicle' })
    type_vehicle: VehicleType;

    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 1000, description: 'Capacity of the vehicle in kg' })
    capacity: number;

    @IsUUID()
    @ApiProperty({ example: 'uuid-user-id', description: 'User ID who owns the vehicle' })
    userId: string;
}

export class UpdateDeliveryVehicleDto {
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'ABC1234', description: 'License plate of the vehicle', required: false })
    license_plate?: string;

    @IsOptional()
    @IsEnum(VehicleType)
    @ApiProperty({ enum: VehicleType, example: VehicleType.TRUCK, description: 'Type of the vehicle', required: false })
    type_vehicle?: VehicleType;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 1000, description: 'Capacity of the vehicle in kg', required: false })
    capacity?: number;

    @IsOptional()
    @IsEnum(VehicleState)
    @ApiProperty({ enum: VehicleState, example: VehicleState.OPERATIONAL, description: 'Current state of the vehicle', required: false })
    state?: VehicleState;

    @IsOptional()
    @IsUUID()
    @ApiProperty({ example: 'uuid-user-id', description: 'User ID who owns the vehicle', required: false })
    userId?: string;
}

export class SetOperationalDto {
    @ApiProperty({ example: 'uuid-del-vehiculo' })
    @IsUUID()
    vehicleId: string;
}

export class ReceiveLocationDto {
    deliveryVehicleId: string;
    lat: number;
    lng: number;
}