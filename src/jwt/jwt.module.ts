import { Module } from '@nestjs/common';
import { key } from './jwt.constants';
import { JwtModule as JWTModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

const jwtModule = JWTModule.register({
  secret: key,
  signOptions: { expiresIn: '60s' },
});

@Module({
  imports: [jwtModule],
  providers: [JwtStrategy],
  exports: [jwtModule, JwtStrategy],
})
export class JwtModule {}
