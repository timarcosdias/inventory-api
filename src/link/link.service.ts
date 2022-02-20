import { Injectable } from '@nestjs/common';
import { Link, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LinkService {
  constructor(private prismaService: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LinkWhereUniqueInput;
    where?: Prisma.LinkWhereInput;
  }): Promise<Link[]> {
    const { skip, take, cursor, where } = params;
    return this.prismaService.link.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async findOne(id: number): Promise<Link | null> {
    return this.prismaService.link.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data: Prisma.LinkCreateInput): Promise<Link> {
    return this.prismaService.link.create({ data });
  }

  async update(id, data: Prisma.LinkUpdateInput): Promise<Link> {
    return this.prismaService.link.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Link> {
    return this.prismaService.link.delete({ where: { id } });
  }
}
