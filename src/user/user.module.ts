import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LinkModule } from 'src/link/link.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleModule } from 'src/role/role.module';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [AuthModule, LinkModule, RoleModule, PrismaModule],
  exports: [UserService],
})
export class UserModule {}
