import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { GuildEntity } from '../guild/guild.entity';

@Entity('guild_application')
export class GuildApplicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.guildApplications, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GuildEntity, (guild) => guild.guildApplications, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guild_id' })
  guild: GuildEntity;
}
