import { RefreshToken } from '.prisma/client';
import {
  UnprocessableEntityException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPersonalData } from 'src/user/model/user-personal-data.dto';
import { inspect } from 'util';
import { UserPayload } from './model/user-payload.dto';

export interface RefreshTokenPayload {
  jti: number;
  sub: number;
}

@Injectable()
export class TokenService {
  public constructor(
    private jwt: JwtService,
    private prismaService: PrismaService,
  ) {}

  public async generateAccessToken(user: UserPersonalData): Promise<string> {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role.name,
    };

    return this.jwt.signAsync(payload);
  }

  public async generatePermanentAccessToken(
    user: UserPayload,
  ): Promise<string> {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    const options: SignOptions = {
      expiresIn: '100y',
    };

    return this.jwt.signAsync(payload, options);
  }

  public async generateRefreshToken(
    userId: number,
    expiresIn: number,
  ): Promise<string> {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + expiresIn);

    const token = await this.prismaService.refreshToken.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
        expiresIn: expiration,
        isRevoked: false,
      },
      update: {
        expiresIn: expiration,
        isRevoked: false,
      },
    });

    const opts: SignOptions = {
      expiresIn,
      subject: String(userId),
      jwtid: String(token.id),
    };

    return this.jwt.signAsync({}, opts);
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: UserPersonalData }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: UserPersonalData; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwt.verifyAsync(token);
    } catch (e) {
      Logger.log(inspect(e));
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<UserPersonalData> {
    const subId = +payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.prismaService.user.findUnique({
      where: { id: subId },
      select: {
        id: true,
        username: true,
        isActive: true,
        role: {
          select: { id: true, name: true },
        },
      },
    });
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = +payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.prismaService.refreshToken.findUnique({
      where: { id: tokenId },
    });
  }

  public async revokeRefreshTokenByUserId(
    userId: number,
  ): Promise<RefreshToken> {
    return await this.prismaService.refreshToken.update({
      where: {
        userId: userId,
      },
      data: {
        isRevoked: true,
      },
    });
  }
}
