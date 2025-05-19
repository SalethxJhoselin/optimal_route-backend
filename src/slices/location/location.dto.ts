import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLocationDto {
    @IsNumber()
    @ApiProperty({ example: -17.7833, description: 'Latitude of the location' })
    latitude: number;

    @IsNumber()
    @ApiProperty({ example: -63.1821, description: 'Longitude of the location' })
    longitude: number;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({ example: '2025-05-16T10:30:00Z', description: 'Capture time of the location in ISO8601 format' })
    capture_time: Date;
}

export class UpdateLocationDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: -17.7833, description: 'Latitude of the location', required: false })
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: -63.1821, description: 'Longitude of the location', required: false })
    longitude?: number;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ example: '2025-05-16T10:30:00Z', description: 'Capture time of the location in ISO8601 format', required: false })
    capture_time?: Date;
}
