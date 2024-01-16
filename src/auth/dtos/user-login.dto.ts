import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';
import { UserRole } from 'src/users/users.entity';

export class UserLoginDto {
  @ApiProperty()
  emailOrPhone: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.STORE,
  })
  role: UserRole;
}
