import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'nuevaContrasena123' })
    @IsString()
    @MinLength(8)
    newPassword: string;
}
