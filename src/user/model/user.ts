import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RefreshToken } from 'src/auth/model/refresh-token';
import { Role } from 'src/role/model/role';
import { Link } from '../../link/link.model';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  username?: string;

  @Field((type) => Int)
  roleId: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field()
  isActive: boolean;

  @Field((type) => Role)
  role: Role;

  @Field((type) => RefreshToken)
  refreshToken: RefreshToken;

  @Field((type) => [Link])
  links: Link[];
}
