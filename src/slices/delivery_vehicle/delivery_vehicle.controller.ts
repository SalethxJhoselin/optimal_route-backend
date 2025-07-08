import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateDeliveryVehicleDto, SetOperationalDto, UpdateDeliveryVehicleDto } from './delivery_vehicle.dto';
import { DeliveryVehicleService } from './delivery_vehicle.service';

@ApiBearerAuth()
@UseGuards()
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
}
