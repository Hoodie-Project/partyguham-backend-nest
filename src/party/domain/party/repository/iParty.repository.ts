import { Party } from '../party';

export interface IPartyRepository {
  create: (partyTypeId: number, title: string, content: string, image: string) => Promise<Party>;
  findOne: (partyId: number) => Promise<Party>;
  update: (partyId: number, title: string, content: string, image: string) => Promise<void>;
  delete: (partyId: number) => Promise<void>;
}
