import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/infra/db/entity/user.entity';

export enum PlatformEnum {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

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

  @Column({ nullable: false })
  externalId: string;

  @Column('enum', { enum: PlatformEnum })
  platform: PlatformEnum;

  @Column('enum', { enum: ProviderEnum, default: ProviderEnum.KAKAO })
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
