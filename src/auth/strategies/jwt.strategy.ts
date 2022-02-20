import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserPayload } from '../model/user-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Receives verified and decoded JWT and returns a user object
  // The user object is injected in the request context
  async validate(payload: any): Promise<UserPayload> {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
