import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Link {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  url?: string;
}
