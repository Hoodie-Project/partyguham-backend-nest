import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PartyEntity } from '../party/party.entity';

@Entity('party_invite')
export class PartyInviteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.partyInvites)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PartyEntity, (post) => post.partyInvites)
  @JoinColumn({ name: 'party_post_id' })
  party: PartyEntity;
}
