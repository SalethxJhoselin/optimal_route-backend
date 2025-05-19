import { Controller } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    /*@Post()
    create(@Body() dto: CreateLocationDto) {
        return this.locationService.create(dto);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.locationService.findOne(id);
    }*/
}
