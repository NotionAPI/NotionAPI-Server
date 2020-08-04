import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPipe } from './auth.pipe';
import { JwtGuard } from '../jwt/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Put()
  async register(
    @Body(AuthPipe) body: { email: string; password: string },
  ): Promise<{ jwt: string } | any> {
    await this.authService.register(body.email, body.password);
    return { jwt: this.jwtService.sign({ email: body.email }) };
  }

  @Post()
  @HttpCode(200)
  async login(
    @Body(AuthPipe) body: { email: string; password: string },
  ): Promise<{ jwt: string } | any> {
    await this.authService.login(body.email, body.password);
    return { jwt: this.jwtService.sign({ email: body.email }) };
  }

  @UseGuards(JwtGuard)
  @Delete()
  async delete(@Req() req) {
    console.log(req);
    await this.authService.delete(req.user.email);
  }
}
