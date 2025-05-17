import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fetch from 'node-fetch';
import { UserWorkStatus } from 'src/enums/user_state.enum';
import { supabase } from 'src/shared/supabase.client';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { User } from '../user/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login_response.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>, private roleService: RoleService) { }

    async register(dto: RegisterDto) {
        // 1. Registrar usuario en Supabase
        const { data, error } = await supabase.auth.signUp({
            email: dto.email,
            password: dto.password,
        });


        if (error || !data.user) {
            throw new UnauthorizedException(error?.message ?? 'Error al registrar usuario');
        }
        // 2. Verificamos roles
        const totalUsers = await this.userRepo.count();
        const adminRole = await this.roleService.getRoleByName('ADMINISTRADOR');
        const repartidorRole = await this.roleService.getRoleByName('REPARTIDOR');
        if (!adminRole || !repartidorRole) {
            throw new UnauthorizedException('Roles no inicializados');
        }
        // 3. Asignar rol según si es el primer usuario
        const assignedRole = totalUsers === 0 ? adminRole : repartidorRole;

        // 4. Crear usuario local
        const newUser = this.userRepo.create({
            id: data.user.id,
            email: dto.email,
            name: dto.name,
            phone_number: dto.phone_number,
            state: UserWorkStatus.AVAILABLE,
            role: assignedRole,
        });

        await this.userRepo.save(newUser);
        return {
            message: 'Usuario registrado correctamente',
            user: newUser,
        };
    }

    async login(dto: LoginDto): Promise<LoginResponseDto> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: dto.email,
            password: dto.password,
        });

        if (error) throw new UnauthorizedException(error.message);

        const localUser = await this.userRepo.findOne({
            where: { id: data.user.id },
            relations: ['role'],
        });

        if (!localUser) { throw new UnauthorizedException('Usuario local no encontrado'); }

        return {
            user: {
                id: data.user.id,
                email: data.user.email,
                email_confirmed_at: data.user.email_confirmed_at,
                phone_number: localUser.phone_number,
                state: localUser.state,
                role: {
                    id: localUser.role.id,
                    name: localUser.role.name,
                },
                created_at: localUser.created_at.toISOString(),
                updated_at: localUser.updated_at.toISOString(),
            },
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
        };
    }

    async changePassword(accessToken: string, newPassword: string) {
        // Obtén el usuario autenticado con el token
        const { data: userData, error: getUserError } = await supabase.auth.getUser(accessToken);
        if (getUserError || !userData.user) {
            throw new UnauthorizedException('No se pudo obtener el usuario');
        }
        // Actualiza la contraseña del usuario con el método de Supabase
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) {
            throw new UnauthorizedException(error.message);
        }
        return {
            message: 'Contraseña actualizada correctamente',
            user: data.user,
        };
    }

    async requestPasswordReset(email: string) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/auth/update-password', // Cambiar esta URL para el frontend
        });

        if (error) {
            throw new UnauthorizedException(error.message);
        }

        return {
            message: 'Correo de recuperación enviado. Por favor revisa tu bandeja de entrada.',
        };
    }

    // Este método se llama desde el frontend después de que el usuario hace clic en el enlace del correo
    //recomendable manejarlo desde el frontend TODO: corregir
    async updatePasswordWithToken(newPassword: string, accessToken: string) {
        const supabaseUrl = process.env.SUPABASE_URL;

        const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (!res.ok) {
            const errorData = await res.json() as { message?: string };
            throw new UnauthorizedException('Error al actualizar contraseña: ' + (errorData.message || res.statusText));
        }

        const data = await res.json();

        return {
            message: 'Contraseña actualizada correctamente',
            user: data,
        };
    }

}
