import { Reflector } from '@nestjs/core';
import { StoreRole } from 'src/users/users.entity';

export const StoreRoles = Reflector.createDecorator<StoreRole[]>();
