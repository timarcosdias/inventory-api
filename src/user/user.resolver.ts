import { Logger } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LinkService } from 'src/link/link.service';
import { RoleService } from 'src/role/role.service';
import { inspect } from 'util';
import { User } from './model/user';
import { UserCreateInput } from './model/user-create';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly linkService: LinkService,
    private readonly roleService: RoleService,
  ) {}

  @Query((returns) => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOneById(id);
  }

  @ResolveField()
  async role(@Parent() user: User) {
    const {
      role: { id: roleId },
    } = user;
    Logger.log(inspect(user));
    return this.roleService.findOneById(roleId);
  }

  @ResolveField()
  async links(@Parent() user: User) {
    const { id } = user;
    return this.linkService.findAll({ where: { userId: id } });
  }

  @Mutation((returns) => User)
  async createUser(@Args('input') input: UserCreateInput) {
    return this.userService.create({
      ...input,
      isActive: true,
    });
  }
}
