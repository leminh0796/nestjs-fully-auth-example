import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

@ApiTags('status')
@Controller()
export class AppController {
  @SkipAuth()
  @Get('/health-check')
  healthCheck(): string {
    return 'OK';
  }
}
