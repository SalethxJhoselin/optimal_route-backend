import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, } from '@nestjs/common';
import { CreateDeliveryVehicleDto, ReceiveLocationDto, SetOperationalDto, UpdateDeliveryVehicleDto } from './delivery_vehicle.dto';
import { DeliveryVehicleService } from './delivery_vehicle.service';


@Controller('delivery-vehicles')
export class DeliveryVehicleController {
    constructor(private readonly vehicleService: DeliveryVehicleService) { }

    @Get()
    findAll() {
        return this.vehicleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.vehicleService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateDeliveryVehicleDto) {
        return this.vehicleService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDeliveryVehicleDto) {
        return this.vehicleService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.vehicleService.remove(id);
    }

    @Post('set-operational/:userId')
    async setOperational(@Param('userId', ParseUUIDPipe) userId: string, @Body() dto: SetOperationalDto,) {
        return this.vehicleService.setVehicleOperational(userId, dto.vehicleId);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId', ParseUUIDPipe) userId: string,) {
        return this.vehicleService.findByUserId(userId);
    }

    @Post('obtener-ubicacion')
    async recibirUbicacion(@Body() dto: ReceiveLocationDto) {
        return this.vehicleService.receiveLocation(dto.deliveryVehicleId, dto.lat, dto.lng);
    }
}
