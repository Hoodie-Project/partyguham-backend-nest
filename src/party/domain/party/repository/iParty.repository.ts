import { Party } from '../party';

export interface IPartyRepository {
  create: (title: string, content: string) => Promise<Party>;
  findOne: (partyId: number) => Promise<Party>;
  update: (partyId: number, title: string, content: string) => Promise<void>;
  delete: (partyId: number) => Promise<void>;
}
