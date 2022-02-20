import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserPersonalData } from 'src/user/model/user-personal-data.dto';
import { TokenService } from './token.service';
import { jwtConstants } from './constants';
import { AuthenticationPayload } from './model/authentication-payload.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from 'src/auth/model/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  // Used by local strategy before the /login route handler
  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserPersonalData> {
    const user = await this.prismaService.user.findFirst({
      where: { username, isActive: true },
      select: {
        id: true,
        username: true,
        password: true,
        isActive: true,
        role: {
          select: { id: true, name: true },
        },
      },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Issues a JWT on /login
  async login(user: UserPersonalData): Promise<AuthenticationPayload> {
    return {
      accessToken: await this.tokenService.generateAccessToken(user),
      refreshToken: await this.tokenService.generateRefreshToken(
        user.id,
        jwtConstants.refreshTokenExpiration,
      ),
      user,
    };
  }

  async refresh(refreshToken: string): Promise<AuthenticationPayload> {
    const { user, token } =
      await this.tokenService.createAccessTokenFromRefreshToken(refreshToken);

    return {
      accessToken: token,
      refreshToken: refreshToken,
      user,
    };
  }

  async updatePassword(id: number, data: UpdatePasswordDto): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        role: {
          select: { name: true },
        },
      },
    });
    if (user && (await bcrypt.compare(data.oldPassword, user.password))) {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(data.newPassword, salt);
      const { password, ...rest } = await this.prismaService.user.update({
        where: { id },
        data: { password: encryptedPassword },
      });
      return rest;
    }
    throw new UnauthorizedException();
  }
}
