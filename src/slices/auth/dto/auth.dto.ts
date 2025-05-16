import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";
export class RegisterDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsString()
    name: string;

    @IsNumber()
    phone_number: number;
}

// login.dto.ts
export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}