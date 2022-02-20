import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/model/user';

@ObjectType()
export class RefreshToken {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  userId: number;

  @Field()
  expiresIn: string;

  @Field()
  isRevoked: boolean;

  @Field((type) => [User])
  user: User;
}
