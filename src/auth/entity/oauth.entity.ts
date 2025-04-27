import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { UserEntity } from '../../user/infra/db/entity/user.entity';

export enum ProviderEnum {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

@Entity({ name: 'oauth' })
export class OauthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  userId: number;

  @Column({ nullable: true, default: null })
  userIdaasdf: number;

  @Column({ nullable: false })
  externalId: string;

  @Column('enum', { enum: ProviderEnum, nullable: false })
  provider: ProviderEnum;

  @Column({ nullable: true })
  accessToken: string;

  @ManyToOne(() => UserEntity, (user) => user.auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}
