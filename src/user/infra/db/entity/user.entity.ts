import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

import { UserSkillEntity } from './user-skill.entity';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { FollowEntity } from 'src/user/infra/db/entity/follow.entity';
import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';
import { PartyInvitationEntity } from 'src/party/infra/db/entity/apply/party_invitation.entity';
import { AuthEntity } from 'src/auth/entity/auth.entity';
import { UserCareerEntity } from './user-career.entity';
import { OauthEntity } from '../../../../auth/entity/oauth.entity';
import { UserLocationEntity } from './user-location.entity';
import { GuildApplicationEntity } from 'src/guild/infra/db/entity/apply/guild_application.entity';
import { GuildInvitationEntity } from 'src/guild/infra/db/entity/apply/guild_invitation.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true, unique: true })
  email: string;

  @Column('varchar', { length: 15, nullable: true, unique: true })
  nickname: string;

  @Column('date', { nullable: true })
  birth: string;

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

  @OneToMany(() => UserSkillEntity, (userSkill) => userSkill.user)
  userSkills: UserSkillEntity[];

  @OneToMany(() => UserLocationEntity, (userLocation) => userLocation.user)
  userLocation: UserLocationEntity[];

  @OneToMany(() => PartyApplicationEntity, (userExperience) => userExperience.user)
  partyApplication: PartyApplicationEntity[];

  @OneToMany(() => PartyInvitationEntity, (partyInvite) => partyInvite.user)
  partyInvitations: PartyInvitationEntity[];

  @OneToMany(() => GuildApplicationEntity, (guildApplication) => guildApplication.user)
  guildApplications: GuildApplicationEntity[];

  @OneToMany(() => GuildInvitationEntity, (userExperience) => userExperience.user)
  guildInvitations: GuildInvitationEntity[];
}
