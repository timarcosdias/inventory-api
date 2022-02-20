import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/model/user';

@ObjectType()
export class Role {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description?: string;

  @Field((type) => [User])
  users: User[];
}
