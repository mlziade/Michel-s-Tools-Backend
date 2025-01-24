import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginContractDto } from 'src/contracts/requests/auth.contract.request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginContractDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    return this.authService.login(user);
  }
}
