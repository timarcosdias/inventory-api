import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class UserUpdateInput {
  @Field()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]{6,16}$/)
  username: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/)
  password: string;

  @Field()
  @IsNotEmpty()
  personId: number;

  @Field()
  @IsNotEmpty()
  roleId: number;

  @Field()
  @IsNotEmpty()
  isActive: boolean;
}
