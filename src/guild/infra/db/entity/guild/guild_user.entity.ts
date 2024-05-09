import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GuildEntity } from './guild.entity';

export enum Authority {
  MASTER = 'master',
  EDITOR = 'editor',
  MEMBER = 'member',
}

@Entity('guild_user')
export class GuildUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  guildId: number;

  @Column({ type: 'enum', enum: Authority, default: Authority.MEMBER })
  authority: string;

  @ManyToOne(() => UserEntity, (user) => user.parties, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => GuildEntity, (guild) => guild.guildUser, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guild_id', referencedColumnName: 'id' })
  guild: GuildEntity;
}
