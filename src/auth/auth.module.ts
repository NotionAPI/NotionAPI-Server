import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from '../firebase/firebase.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
