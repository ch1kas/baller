import { BaseEntity } from 'src/modules/base.entity';
import { UserEntity } from 'src/modules/user/models/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
