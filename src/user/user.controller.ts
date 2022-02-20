import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserUpdateInput } from './model/user-update';
import { UserService } from './user.service';

@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.userService.create(data);
  }

  @Get()
  findAll(@Query('onlyPersons') onlyPersons: string | boolean) {
    onlyPersons = onlyPersons === 'true';
    if (onlyPersons) {
      return this.userService.findAll({ where: { roleId: { in: [1, 2] } } });
    } else {
      return this.userService.findAll({});
    }
  }

  @Get(':usernameOrId')
  findOne(@Param('usernameOrId') usernameOrId: string) {
    if (isNaN(parseInt(usernameOrId))) {
      return this.userService.findOneByUsername(usernameOrId);
    } else {
      return this.userService.findOneById(+usernameOrId);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UserUpdateInput) {
    return this.userService.updateUserAndRevokeRefreshToken(+id, data);
  }
}
