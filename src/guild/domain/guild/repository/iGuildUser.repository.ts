import { GuildUserEntity } from 'src/guild/infra/db/entity/guild/guild_user.entity';

export interface IGuildUserRepository {
  createUser: (userId: number, partyId: number, postionId: number) => Promise<void>;
  createMaster: (userId: number, partyId: number) => Promise<void>;
  createEditor: (userId: number, partyId: number, postionId: number) => Promise<void>;
  findOne: (userId: number, partyId: number) => Promise<GuildUserEntity>;
}
