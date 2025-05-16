import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return this.userService.getById(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.userService.delete(id);
    }

    @Post('disable/:id')
    disable(@Param('id') id: string): Promise<User> {
        return this.userService.disable(id);
    }

    @Post('enable/:id')
    enable(@Param('id') id: string): Promise<User> {
        return this.userService.enable(id);
    }
}
