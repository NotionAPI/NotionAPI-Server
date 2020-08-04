import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<void> {
    const users = this.firebaseService.db.collection('users');
    const user = (
      await users.where('email', '==', email).get()
    ).docs[0]?.data();

    if (!user) throw new NotFoundException('user not found');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('incorrect password');
  }

  async register(email: string, password: string): Promise<void> {
    const users = this.firebaseService.db.collection('users');
    const user = (
      await users.where('email', '==', email).get()
    ).docs[0]?.data();

    if (user) throw new ForbiddenException('user exists');

    await users.add({
      email,
      password: await bcrypt.hash(password, 5),
      fetchPageRequests: 0,
      fetchCollectionRequests: 0,
    });
  }

  async delete(email: string): Promise<void> {
    const users = this.firebaseService.db.collection('users');
    const user = (await users.where('email', '==', email).get()).docs[0];

    if (!user) throw new NotFoundException('user not found');

    await users.doc(user.id).delete();
  }
}
