import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { supabase } from 'src/shared/supabase.client';
import { User } from 'src/slices/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegisterGuard implements CanActivate {
    constructor(@InjectRepository(User) private userRepo: Repository<User>,) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const userCount = await this.userRepo.count();

        if (userCount === 0) {
            return true;
        }

        // Para otros casos, validar token normal
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedException('Token de autorización requerido');
        }

        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            throw new UnauthorizedException('Token inválido');
        }

        req.user = data.user;
        return true;
    }
}
