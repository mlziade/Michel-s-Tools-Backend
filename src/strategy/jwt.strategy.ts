import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /*
  * This method is used to validate the JWT token
  * It takes the payload of the token as an argument and returns an object containing the user ID and username 
  */
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username,
    };
  }
}
