import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
    @ApiProperty({ example: 'usuario@example.com' })
    @IsEmail()
    email: string;
}

export class UpdatePasswordWithTokenDto {
    @ApiProperty({ example: 'nuevaContrasenaSegura123' })
    @IsString()
    @MinLength(8)
    newPassword: string;
}