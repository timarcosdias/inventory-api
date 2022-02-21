import { Inject, Logger } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { LinkService } from 'src/link/link.service';
import { RoleService } from 'src/role/role.service';
import { inspect } from 'util';
import { User } from './model/user';
import { UserCreateInput } from './model/user-create';
import { UserService } from './user.service';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly linkService: LinkService,
    private readonly roleService: RoleService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
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
    const newUser = await this.userService.create({
      ...input,
      isActive: true,
    });
    this.pubSub.publish('userAdded', { userAdded: newUser });
    return newUser;
  }

  @Subscription((returns) => User)
  userAdded() {
    return this.pubSub.asyncIterator('userAdded');
  }
}
