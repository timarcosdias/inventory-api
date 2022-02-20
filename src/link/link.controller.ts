import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('properties')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  create(@Body() data: Prisma.LinkCreateInput) {
    return this.linkService.create(data);
  }

  @Get()
  findAll() {
    return this.linkService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.LinkUpdateInput) {
    return this.linkService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.linkService.remove(+id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new HttpException(
            {
              status: HttpStatus.CONFLICT,
              error: 'Foreign key constraint violation',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
    }
  }
}
