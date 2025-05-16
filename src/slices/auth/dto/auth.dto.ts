import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'usuario@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;

    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    name: string;

    @IsOptional()
    @ApiProperty({ example: 12345678, required: false })
    @IsNumber()
    phone_number?: number;
}

export class LoginDto {
    @ApiProperty({ example: 'mamjhoss@gmail.com' })
    email: string;

    @ApiProperty({ example: 'develop2025' })
    password: string;
}