import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, loginSchema } from '@/auth/schemas/login.schema';
import { SignupDto, signupSchema } from '@/auth/schemas/signup.schema';
import { ZodPipe } from '@/common/helpers/zod.helper';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body(ZodPipe(signupSchema)) body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body(ZodPipe(loginSchema)) body: LoginDto) {
    return this.authService.login(body);
  }
}
