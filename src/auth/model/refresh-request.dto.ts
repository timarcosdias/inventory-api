import { IsNotEmpty } from 'class-validator';

export class RefreshRequest {
  @IsNotEmpty({ message: 'The refresh token is required' })
  refreshToken: string;
}
