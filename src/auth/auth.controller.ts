import { Controller, Post, UseGuards, Req, Delete } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { UserData } from 'src/users/users.interface';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { UserRole } from 'src/users/users.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identity: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        role: {
          type: 'string',
          enum: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.STORE],
        },
      },
    },
  })
  login(@Req() req: Request) {
    let xForwardedFor = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'];

    if (!xForwardedFor) {
      xForwardedFor = req.socket.remoteAddress;
    }

    if (!xForwardedFor) {
      xForwardedFor = '';
    }

    return this.authService.login(
      req.user as UserData,
      req.headers['user-agent'] as string,
      xForwardedFor.trim(),
    );
  }

  @Delete('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.headers['authorization']);
  }
}
