import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
  }): Promise<Role[]> {
    const { skip, take, cursor, where } = params;
    return this.prismaService.role.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async findOneById(id: number): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: { id },
    });
  }
}
