import { StoreRole, UserRole } from './users.entity';

export interface UserData {
  uuid: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  storeRole: StoreRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRO {
  user: UserData;
}
