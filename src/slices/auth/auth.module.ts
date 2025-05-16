import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        RoleModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
