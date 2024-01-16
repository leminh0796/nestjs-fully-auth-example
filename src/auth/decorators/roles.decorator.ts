import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/users.entity';

export const Roles = Reflector.createDecorator<UserRole[]>();
