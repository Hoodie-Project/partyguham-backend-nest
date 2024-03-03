import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/infra/db/entity/user.entity';

export enum PlatformEnum {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

@Entity()
export class OauthEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  userId: number;

  @Column({ nullable: false })
  externalId: string;

  @Column('enum', { enum: PlatformEnum })
  platform: PlatformEnum;

  @Column({ nullable: true })
  accessToken: string;

  @ManyToOne(() => UserEntity, (user) => user.auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}
