import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APIModule } from './api/api.module';

@Module({
  imports: [AuthModule, APIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
