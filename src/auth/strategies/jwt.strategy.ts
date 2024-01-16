import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const dbSession = await this.authService.findSession(accessToken);
    if (!dbSession) {
      throw new UnauthorizedException('Unauthorized');
    }
    return {
      uuid: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      storeRole: payload.storeRole,
    };
  }
}
