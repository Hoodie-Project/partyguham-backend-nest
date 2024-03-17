import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

import { UserSkillEntity } from './user-skill.entity';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party-user.entity';
import { FollowEntity } from 'src/user/infra/db/entity/follow.entity';
import { PartyRequestEntity } from 'src/party/infra/db/entity/apply/party-request.entity';
import { PartyInviteEntity } from 'src/party/infra/db/entity/apply/party-invite.entity';
import { AuthEntity } from 'src/auth/entity/auth.entity';
import { PartyCommentEntity } from 'src/party/infra/db/entity/party/party-comment.entity';
import { UserCareerEntity } from './user-career.entity';
import { OauthEntity } from '../../../../auth/entity/oauth.entity';
import { UserLocationEntity } from './user-location.entity';

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

  @Column('char', { length: 1 }) // 'M' 또는 'F'
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

  @OneToMany(() => UserCareerEntity, (userCareer) => userCareer.user)
  userCareers: UserCareerEntity[];

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

  @OneToMany(() => UserLocationEntity, (userLocation) => userLocation.user)
  userLocation: UserLocationEntity[];

  @OneToMany(() => PartyRequestEntity, (userExperience) => userExperience.user)
  partyRequests: PartyRequestEntity[];

  @OneToMany(() => PartyInviteEntity, (userExperience) => userExperience.user)
  partyInvites: PartyInviteEntity[];
}
