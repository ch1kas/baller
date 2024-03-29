import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../roles/enums/roles';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({})
  full_name: string;

  @Column({})
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    nullable: true,
    default: null,
  })
  confirmed_at: Date;

  @Column({ nullable: true })
  confirmation_token: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  roles: Role[];
}
