import { Guild } from '../guild';

export interface IGuildRepository {
  create: (title: string, content: string) => Promise<Guild>;
  findOne: (partyId: number) => Promise<Guild>;
  update: (partyId: number, title: string, content: string) => Promise<void>;
  delete: (partyId: number) => Promise<void>;
}
