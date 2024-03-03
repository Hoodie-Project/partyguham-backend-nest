import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

import { UserSkillEntity } from './user-skill.entity';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party-user.entity';
import { FollowEntity } from 'src/user/infra/db/entity/follow.entity';
import { PartyRequestEntity } from 'src/party/infra/db/entity/apply/party-request.entity';
import { PartyInviteEntity } from 'src/party/infra/db/entity/apply/party-invite.entity';
import { AuthEntity } from 'src/auth/entity/auth.entity';
import { PartyCommentEntity } from 'src/party/infra/db/entity/party/party-comment.entity';
import { UserPositionEntity } from './user-position.entity';
import { OauthEntity } from './oauth.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true, unique: true })
  email: string;

  @Column('varchar', { length: 15, nullable: true, unique: true })
  nickname: string;

  @Column('date', { nullable: true })
  birth: Date;

  @Column({ length: 1, enum: ['M', 'F'] }) // 'M' 또는 'F'
  gender: string;

  @Column('boolean', { nullable: false, default: true })
  birthVisible: Boolean;

  @Column('boolean', { nullable: false, default: true })
  genderVisible: Boolean;

  @Column('varchar', { nullable: true })
  image: string;

  @OneToOne(() => AuthEntity, (auth) => auth.user)
  auth: AuthEntity;

  @OneToMany(() => OauthEntity, (oauth) => oauth.user)
  oauth: OauthEntity[];

  @OneToMany(() => UserPositionEntity, (userPosition) => userPosition.user)
  userPositions: UserPositionEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followers: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followings: FollowEntity[];

  @OneToMany(() => PartyUserEntity, (party) => party.user)
  parties: PartyUserEntity[];

  @OneToMany(() => PartyCommentEntity, (party) => party.user)
  comments: PartyUserEntity[];

  @OneToMany(() => UserSkillEntity, (userSkill) => userSkill.user)
  userSkills: UserSkillEntity[];

  @OneToMany(() => PartyRequestEntity, (userExperience) => userExperience.user)
  partyRequests: PartyRequestEntity[];

  @OneToMany(() => PartyInviteEntity, (userExperience) => userExperience.user)
  partyInvites: PartyInviteEntity[];
}
