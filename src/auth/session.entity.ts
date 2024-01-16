import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/common/entites';
import { User } from 'src/users/users.entity';

@Entity()
export class Session extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  issuedAt: Date;

  @Column()
  expiresAt: Date;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  user: User;
}
