import { IsNotEmpty } from 'class-validator';

export class UserPayload {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  role: string;
}
