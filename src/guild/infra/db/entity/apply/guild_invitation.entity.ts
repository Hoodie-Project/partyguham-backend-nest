import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GuildEntity } from '../guild/guild.entity';

@Entity('guild_invitation')
export class GuildInvitationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.guildInvitations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GuildEntity, (guild) => guild.guildInvitations)
  @JoinColumn({ name: 'guild_id' })
  guild: GuildEntity;
}
