import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min, ValidateNested } from 'class-validator';
import { OrderState } from 'src/enums/order_state.enum';
import { CreateLocationDto, UpdateLocationDto } from '../location/location.dto';

export class CreateOrderDto {
    @IsUUID()
    locationId: string;

    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 12.5, description: 'Volume of the order' })
    volume: number;

    @IsEnum(OrderState)
    @IsOptional()
    @ApiProperty({ enum: OrderState, example: OrderState.PENDING, description: 'Current state of the order', required: false })
    state?: OrderState;

    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 150.75, description: 'Total amount payable for the order' })
    total_payable: number;
}

export class UpdateOrderDto {
    @IsOptional()
    @ValidateNested()
    @ApiProperty({ type: () => UpdateLocationDto })
    location?: UpdateLocationDto;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 12.5, description: 'Volume of the order', required: false })
    volume?: number;

    @IsOptional()
    @IsEnum(OrderState)
    @ApiProperty({ enum: OrderState, example: OrderState.PENDING, description: 'Current state of the order', required: false })
    state?: OrderState;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 150.75, description: 'Total amount payable for the order', required: false })
    total_payable?: number;
}

export class CreateOrderWithLocationDto {
    @ApiProperty({ type: () => CreateOrderDto })
    @ValidateNested()
    @Type(() => CreateOrderDto)
    order: CreateOrderDto;

    @ApiProperty({ type: () => CreateLocationDto })
    @ValidateNested()
    @Type(() => CreateLocationDto)
    location: CreateLocationDto;
}