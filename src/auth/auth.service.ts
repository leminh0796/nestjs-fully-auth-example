import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/users.entity';
import { UserData } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { comparePasswords } from 'src/util';
import { Session } from './session.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async validateUser(
    emailOrPhone: string,
    password: string,
    role: UserRole,
  ): Promise<UserData | null> {
    const user = await this.usersService.findOne(emailOrPhone, role);
    if (user && comparePasswords(password, user.encryptedPassword)) {
      const { encryptedPassword: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserData, userAgent?: string, ipAddress?: string) {
    const accessToken = await this.setSession(user, userAgent, ipAddress);
    return {
      accessToken: accessToken,
    };
  }

  async logout(authorization: string) {
    const accessToken = authorization.split(' ')[1];
    const session = await this.sessionRepository.findOne({
      where: {
        accessToken,
      },
    });
    if (session) {
      await this.sessionRepository.update(
        {
          accessToken,
        },
        {
          expiresAt: new Date(),
        },
      );
    }
    return {
      message: 'Logged out successfully',
    };
  }

  async findSession(accessToken: string): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({
      where: {
        accessToken,
        expiresAt: MoreThan(new Date()),
      },
    });
    return session;
  }

  private async setSession(
    user: UserData,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<string> {
    const currentSession = await this.sessionRepository.findOne({
      where: {
        user: {
          uuid: user.uuid,
        },
        expiresAt: MoreThan(new Date()),
      },
      order: {
        issuedAt: 'DESC',
      },
    });
    if (currentSession) {
      return currentSession.accessToken;
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.uuid,
      role: user.role,
      email: user.email,
      phone: user.phone,
      storeRole: user.storeRole,
    });

    try {
      await this.sessionRepository.save({
        user: {
          uuid: user.uuid,
        },
        accessToken,
        userAgent,
        ipAddress,
        issuedAt: new Date(),
        expiresAt: new Date(
          Date.now() + ms(this.configService.get<string>('TOKEN_EXPIRATION')),
        ),
      });
    } catch (error) {
      throw new HttpException(
        {
          message: ['Something went wrong', error.message],
          error: 'Bad Gateway',
          statusCode: HttpStatus.BAD_GATEWAY,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
    return accessToken;
  }
}
