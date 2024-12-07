import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
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

  @Column({ nullable: false })
  externalId: string;

  @Column('enum', { enum: ProviderEnum, default: ProviderEnum.KAKAO })
  provider: ProviderEnum;

  @Column({ nullable: true })
  accessToken: string;

  @Column('varchar', { nullable: false, default: 'example@email.com' })
  email: string;

  @Column('text', { nullable: true })
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}
