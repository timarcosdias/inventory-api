import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class UserCreateInput {
  @Field()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]{6,16}$/)
  username: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/)
  password: string;

  @Field((type) => Int)
  @IsNotEmpty()
  roleId: number;
}
