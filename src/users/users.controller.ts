import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Request } from 'express';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @Post()
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
  }

  @ApiBearerAuth()
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
