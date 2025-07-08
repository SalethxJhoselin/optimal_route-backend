import { Body, Controller, Headers, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change_password.dto';
import { LoginResponseDto } from './dto/login_response.dto';
import { RegisterGuard } from './guards/register.guard';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Req() req) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        const loginResult = await this.authService.login(dto);
        return plainToInstance(LoginResponseDto, loginResult);
    }

    @ApiBearerAuth()
    @UseGuards(SupabaseAuthGuard)
    @Post('change-password')
    async changePassword(
        @Headers('authorization') authHeader: string,
        @Body() body: ChangePasswordDto,
    ) {
        if (!authHeader) {
            throw new UnauthorizedException('Token de autorización requerido');
        }
        const token = authHeader.replace('Bearer ', '');
        return this.authService.changePassword(token, body.newPassword);
    }
/*
    @Post('request-password-reset')
    async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
        return this.authService.requestPasswordReset(dto.email);
    }

    @ApiBearerAuth()
    @Post('reset-password')
    async updatePasswordWithToken(
        @Headers('authorization') authHeader: string,
        @Body() dto: UpdatePasswordWithTokenDto
    ) {
        if (!authHeader) {
            throw new UnauthorizedException('Token de autorización requerido');
        }

        const token = authHeader.replace('Bearer ', '');
        return this.authService.updatePasswordWithToken(dto.newPassword, token);
    }*/
}
