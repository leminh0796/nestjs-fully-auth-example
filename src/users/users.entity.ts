import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AbstractEntity } from 'src/common/entites';
import { IsEmail, IsPhoneNumber, Length } from 'class-validator';
import { Session } from 'src/auth/session.entity';

export enum UserRole {
  ADMIN = 'admin',
  STORE = 'store',
  CUSTOMER = 'customer',
}

export enum StoreRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
}

@Unique(['phone', 'role'])
@Entity()
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Index()
  @Column({
    type: 'varchar',
    default: '',
  })
  name: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsEmail()
  email: string;

  @Column()
  encryptedPassword: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: StoreRole,
    nullable: true,
  })
  storeRole: StoreRole;

  @Index()
  @Column()
  @Length(10, 20)
  @IsPhoneNumber('VN')
  phone: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
