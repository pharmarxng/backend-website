import { Body, Controller, Logger, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserSignUpDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('process/signup')
  @ApiOperation({
    summary: 'Signs a new user up',
  })
  async signup(@Body() body: UserSignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('process/login')
  @ApiOperation({ summary: `Logs in a user` })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('process/refresh-token')
  @ApiOperation({ summary: 'Refresh token on access token expiration' })
  async handleRefreshToken(@Query('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
