import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
    @ApiProperty({ example: 'usuario@example.com' })
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;

    @ApiProperty({ example: 'Juan Perez' })
    name: string;

    @ApiProperty({ example: 12345678 })
    phone_number: number;
}

export class LoginDto {
    @ApiProperty({ example: 'usuario@example.com' })
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;
}