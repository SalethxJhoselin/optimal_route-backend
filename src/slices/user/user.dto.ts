import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserWorkStatus } from 'src/enums/user_state.enum';
import { RoleDto } from "../role/role.dto";

export class UserDto {
    id: string;
    email?: string;
    email_confirmed_at?: string;
    phone_number?: number;
    state?: string;
    role?: RoleDto;
    user_metadata?: any;
    created_at?: string;
    updated_at?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @ApiProperty({ example: 'Juan Perez', required: false })
    @IsString()
    name?: string;

    @IsOptional()
    @ApiProperty({ example: 'usuario@example.com', required: false })
    @IsEmail()
    email?: string;

    @IsOptional()
    @ApiProperty({ example: 12345678, required: false })
    @IsNumber()
    phone_number?: number;

    @IsOptional()
    @ApiProperty({ example: 'available', enum: UserWorkStatus, required: false })
    @IsEnum(UserWorkStatus)
    state?: UserWorkStatus;

    @IsOptional()
    @ApiProperty({ example: 'uuid-role-id', required: false })
    @IsUUID()
    roleId?: string;
}