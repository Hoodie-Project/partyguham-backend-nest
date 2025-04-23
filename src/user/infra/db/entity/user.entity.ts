import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';
import { PartyInvitationEntity } from 'src/party/infra/db/entity/apply/party_invitation.entity';
import { AuthEntity } from 'src/auth/entity/auth.entity';
import { UserCareerEntity } from './user_career.entity';
import { OauthEntity } from '../../../../auth/entity/oauth.entity';
import { UserLocationEntity } from './user_location.entity';
import { UserPersonalityEntity } from './user_personality.entity';
import { FcmTokenEntity } from 'src/libs/firebase/fcm-token.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { default: null })
  email: string;

  @Column('varchar', { length: 15, nullable: false, unique: true })
  nickname: string;

  @Column('date', { nullable: false })
  birth: string;

  @Column('char', { length: 1, nullable: false }) // 'M' 또는 'F'
  gender: string;

  @Column('boolean', { nullable: false, default: true })
  birthVisible: boolean;

  @Column('boolean', { nullable: false, default: true })
  genderVisible: boolean;

  @Column('varchar', { nullable: true })
  portfolioTitle: string;

  @Column('text', { nullable: true, default: null })
  portfolio: string;

  @Column('text', { nullable: true })
  image: string;

  // 관계형

  @OneToMany(() => FcmTokenEntity, (fcmToken) => fcmToken.user)
  fcmTokens: FcmTokenEntity[];

  @OneToOne(() => AuthEntity, (auth) => auth.user)
  auth: AuthEntity;

  @OneToMany(() => OauthEntity, (oauth) => oauth.user)
  oauths: OauthEntity[];

  @OneToMany(() => UserCareerEntity, (userCareer) => userCareer.user)
  userCareers: UserCareerEntity[];

  @OneToMany(() => UserLocationEntity, (userLocation) => userLocation.user)
  userLocations: UserLocationEntity[];

  @OneToMany(() => UserPersonalityEntity, (UserPersonality) => UserPersonality.user)
  userPersonalities: UserPersonalityEntity[];

  @OneToMany(() => PartyUserEntity, (party) => party.user)
  partyUsers: PartyUserEntity[];

  @OneToMany(() => PartyApplicationEntity, (userExperience) => userExperience.user)
  partyApplications: PartyApplicationEntity[];

  @OneToMany(() => PartyInvitationEntity, (partyInvite) => partyInvite.user)
  partyInvitations: PartyInvitationEntity[];
}
