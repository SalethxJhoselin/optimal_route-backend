import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkStatus } from 'src/enums/user_state.enum';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private roleService: RoleService,
    ) { }

    async getAllUsers(): Promise<User[]> {
        return this.userRepo.find({ relations: ['role'] });
    }

    async getById(id: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['role'] });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async update(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.getById(id);

        if (dto.roleId) {
            const role = await this.roleService.getRoleById(dto.roleId);
            if (!role) throw new NotFoundException('Rol no encontrado');
            user.role = role;
        }

        Object.assign(user, dto);
        return this.userRepo.save(user);
    }

    async delete(id: string): Promise<void> {
        const user = await this.getById(id);
        await this.userRepo.remove(user);
    }

    async disable(id: string): Promise<User> {
        const user = await this.getById(id);
        user.state = UserWorkStatus.UNAVAILABLE;
        return this.userRepo.save(user);
    }

    async enable(id: string): Promise<User> {
        const user = await this.getById(id);
        user.state = UserWorkStatus.AVAILABLE;
        return this.userRepo.save(user);
    }
}
