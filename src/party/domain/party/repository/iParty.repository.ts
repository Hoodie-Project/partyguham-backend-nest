import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';
import { Party } from '../party';

export interface IPartyRepository {
  create: (partyTypeId: number, title: string, content: string, image: string) => Promise<PartyEntity>;
  findOne: (id: number) => Promise<PartyEntity>;
  update: (party: Party) => Promise<PartyEntity>;
  deleteById: (id: number) => Promise<void>;
  archivedById: (id: number) => Promise<void>;
  activeById: (id: number) => Promise<void>;
}
