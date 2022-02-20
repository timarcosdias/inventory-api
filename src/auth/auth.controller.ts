import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { UpdatePasswordDto } from './model/update-password.dto';
import { RefreshRequest } from './model/refresh-request.dto';
import { UserPayload } from './model/user-payload.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body() data: RefreshRequest) {
    return this.authService.refresh(data.refreshToken);
  }

  @Roles('admin', 'client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update-password')
  updatePassword(@Request() req, @Body() data: UpdatePasswordDto) {
    return this.authService.updatePassword(+(req.user as UserPayload).id, data);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('access-token')
  async generatePermanentAccessToken(@Body() data: UserPayload) {
    return {
      token: await this.tokenService.generatePermanentAccessToken(data),
    };
  }
}
