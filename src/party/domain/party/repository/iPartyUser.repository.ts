import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

export interface IPartyUserRepository {
  createMember: (userId: number, partyId: number, partyTypeId: number) => Promise<void>;
  createMaster: (userId: number, partyId: number, partyTypeId: number) => Promise<void>;
  createEditor: (userId: number, partyId: number, partyTypeId: number) => Promise<void>;
  findOne: (userId: number, partyId: number) => Promise<PartyUserEntity>;
}
