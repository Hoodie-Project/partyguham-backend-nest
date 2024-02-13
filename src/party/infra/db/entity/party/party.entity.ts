import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PartyUserEntity } from './party-user.entity';
import { PartyCommentEntity } from './party-comment.entity';
import { PartyLikeEntity } from './party-like.entity';
import { PartyInviteEntity } from '../apply/party-invite.entity';
import { PartyRequestEntity } from '../apply/party-request.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity('party')
export class PartyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  partyStatus: string;

  @Column({ nullable: true })
  projectStatus: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @OneToMany(() => PartyUserEntity, (partyUser) => partyUser.party)
  partyUser: PartyUserEntity[];

  @OneToMany(() => PartyLikeEntity, (partyLike) => partyLike.party)
  partyLikes: PartyLikeEntity[];

  @OneToMany(() => PartyCommentEntity, (comment) => comment.party)
  comments: PartyCommentEntity[];

  @OneToMany(() => PartyRequestEntity, (partyRequests) => partyRequests.party)
  partyRequests: PartyRequestEntity[];

  @OneToMany(() => PartyInviteEntity, (partyInvites) => partyInvites.party)
  partyInvites: PartyInviteEntity[];
}
