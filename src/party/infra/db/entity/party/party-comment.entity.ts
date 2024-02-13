import { BaseEntity } from 'src/common/entity/baseEntity';
import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

import { PartyEntity } from './party.entity';

@Entity('party_comment')
export class PartyCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  partyId: number;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (post) => post.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PartyEntity, (post) => post.comments)
  @JoinColumn({ name: 'party_id' })
  party: PartyEntity;
}
