import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { PartyEntity } from '../party/party.entity';

@Entity('party_request')
export class PartyRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.partyRequests, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PartyEntity, (post) => post.partyRequests, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_post_id' })
  party: PartyEntity;
}
