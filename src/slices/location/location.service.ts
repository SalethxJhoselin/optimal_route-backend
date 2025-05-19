import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './location.dto';
import { Location } from './location.enity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private locationRepo: Repository<Location>,
    ) { }

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const location = this.locationRepo.create(createLocationDto);
        return this.locationRepo.save(location);
    }

    async findOne(id: string): Promise<Location> {
        const location = await this.locationRepo.findOne({ where: { id } });
        if (!location) throw new NotFoundException(`Location with id ${id} not found`);
        return location;
    }
}