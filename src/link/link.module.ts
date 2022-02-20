import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { LinksResolver } from './link.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LinkController],
  providers: [LinkService, LinksResolver],
  imports: [PrismaModule],
  exports: [LinkService],
})
export class LinkModule {}
