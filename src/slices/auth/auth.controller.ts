import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login_response.dto';
import { RegisterGuard } from './guards/register.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(RegisterGuard)
    @Post('register')
    async register(@Body() dto: RegisterDto, @Req() req) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        const loginResult = await this.authService.login(dto);
        return plainToInstance(LoginResponseDto, loginResult);
    }
}
