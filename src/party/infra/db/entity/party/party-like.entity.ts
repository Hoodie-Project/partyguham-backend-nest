import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, Unique, CreateDateColumn } from 'typeorm';

import { PartyEntity } from './party.entity';
import { UserEntity } from 'src/user/infra/db/entity/user.entity';

@Entity('party_like')
@Unique(['userId', 'partyId'])
export class PartyLikeEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  partyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => PartyEntity, (post) => post.partyLikes)
  @JoinColumn({ name: 'party_id', referencedColumnName: 'id' })
  party: PartyEntity;
}
