import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { Location } from './location.enity';
import { LocationService } from './location.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    providers: [LocationService],
    controllers: [LocationController],
    exports: [LocationService],
})
export class LocationModule { }
