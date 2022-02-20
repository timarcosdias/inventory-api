import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LinkModule } from 'src/link/link.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleModule } from 'src/role/role.module';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver],
  imports: [AuthModule, LinkModule, RoleModule, PrismaModule],
  exports: [UserService],
})
export class UserModule {}
