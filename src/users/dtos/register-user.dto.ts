import { ApiProperty } from '@nestjs/swagger';
import { StoreRole, UserRole } from '../users.entity';
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.CUSTOMER,
    required: false,
  })
  role: UserRole;

  @ApiProperty({
    enum: StoreRole,
    required: false,
  })
  storeRole: StoreRole;
}
