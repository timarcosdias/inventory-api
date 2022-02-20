import 'reflect-metadata';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Link } from './link.model';
import { LinkService } from './link.service';

@Resolver((of) => Link)
export class LinksResolver {
  constructor(private readonly linksService: LinkService) {}

  @Query((returns) => Link)
  async link(@Args('id', { type: () => Int }) id: number) {
    return this.linksService.findOne(id);
  }
}
