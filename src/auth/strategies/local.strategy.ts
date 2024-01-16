import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserData } from 'src/users/users.interface';
import { UserRole } from 'src/users/users.entity';
import { Request } from 'express';

@Injectable()
export class LocalStragety extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identity',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<UserData | null> {
    if (!Object.values(UserRole).includes(req.body.role)) {
      throw new BadRequestException('Invalid role');
    }

    const role = req.body.role as UserRole;
    if (!role) {
      throw new BadRequestException('Role is required');
    }

    const user = await this.authService.validateUser(username, password, role);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
