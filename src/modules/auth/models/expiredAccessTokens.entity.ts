import { BaseEntity } from 'src/modules/base.entity';
import { UserEntity } from 'src/modules/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('expired_access_tokens')
export class ExpiredAccessTokenEntity extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.expiredAccessTokens, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
