import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserUpdateInput } from './model/user-update';
import { UserPersonalData } from './model/user-personal-data.dto';
import { TokenService } from 'src/auth/token.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
  }): Promise<UserPersonalData[]> {
    const { skip, take, cursor, where } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      select: {
        id: true,
        username: true,
        isActive: true,
        role: {
          select: { name: true },
        },
      },
    });
  }

  async findOneById(id: number): Promise<UserPersonalData | undefined> {
    return this.prismaService.user.findUnique({
      where: { id },
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

  async findOneByUsername(
    username: string,
  ): Promise<UserPersonalData | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        isActive: true,
        role: {
          select: { id: true, name: true },
        },
      },
    });
    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const createdUser = await this.prismaService.user.create({ data });
    await this.tokenService.generateRefreshToken(createdUser.id, 60);
    return createdUser;
  }

  async updateUserAndRevokeRefreshToken(
    id,
    data: UserUpdateInput,
  ): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data,
    });
    await this.tokenService.revokeRefreshTokenByUserId(updatedUser.id);
    return updatedUser;
  }
}
