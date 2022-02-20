import { UserPersonalData } from 'src/user/model/user-personal-data.dto';

export class AuthenticationPayload {
  user: UserPersonalData;
  accessToken: string;
  refreshToken: string;
}
