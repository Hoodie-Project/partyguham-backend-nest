import { GuildUserEntity } from 'src/guild/infra/db/entity/guild/guild_user.entity';

export interface IGuildUserRepository {
  createUser: (userId: number, guildId: number) => Promise<void>;
  createMaster: (userId: number, guildId: number) => Promise<void>;
  createEditor: (userId: number, guildId: number) => Promise<void>;
  findOne: (userId: number, guildId: number) => Promise<GuildUserEntity>;
}
