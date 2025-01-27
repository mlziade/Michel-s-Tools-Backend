import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET'),
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
