import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: any): any {
    if (value.email === '' || !value.email)
      throw new BadRequestException('missing email');
    if (value.password === '' || !value.password)
      throw new BadRequestException('missing password');

    return value;
  }
}
