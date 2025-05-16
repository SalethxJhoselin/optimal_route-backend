import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        RoleModule,
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
