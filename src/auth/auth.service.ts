import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { email } from 'zod';
import { LoginDto } from '@/auth/schemas/login.schema';
import { SignupDto } from '@/auth/schemas/signup.schema';
import { JwtPayload } from '@/auth/types/jwt-payload.type';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    return this.usersService.create({
      ...data,
      password: hashPassword,
    });
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findAuthUser(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
