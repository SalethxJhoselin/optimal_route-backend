import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './slices/auth/auth.module';
import { UserModule } from './slices/user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
