import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: RegisterDto) {
    const { email, names, password } = data;
    const user = await this.authService.checkUserExistence(email);
    if (user) {
      throw new BadRequestException('The email is already taken');
    }
    return this.authService.register(names, email, password);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const { email, password } = data;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user.id, user.names, user.email, user.role);
  }
}
