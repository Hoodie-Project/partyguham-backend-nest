import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GuildUserEntity } from './guild_user.entity';
import { GuildInvitationEntity } from '../apply/guild_invitation.entity';
import { GuildApplicationEntity } from '../apply/guild_application.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity('guild')
export class GuildEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column('smallint', { default: 30 })
  capacity: number;

  @Column('smallint', { default: 1 })
  occupancy: number;

  @Column({ default: null })
  image: string;

  @OneToMany(() => GuildUserEntity, (guildUser) => guildUser.guild)
  guildUser: GuildUserEntity[];

  @OneToMany(() => GuildApplicationEntity, (guildApplicationEntity) => guildApplicationEntity.guild)
  guildApplications: GuildApplicationEntity[];

  @OneToMany(() => GuildInvitationEntity, (guildInvitationEntity) => guildInvitationEntity.guild)
  guildInvitations: GuildInvitationEntity[];
}
