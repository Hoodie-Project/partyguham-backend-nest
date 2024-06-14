import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';
import { Party } from '../party';

export interface IPartyRepository {
  create: (partyTypeId: number, title: string, content: string, image: string) => Promise<PartyEntity>;
  findOne: (partyId: number) => Promise<PartyEntity>;
  update: (party: Party) => Promise<PartyEntity>;
  delete: (partyId: number) => Promise<void>;
}
