import { PartyUserEntity } from 'src/party/infra/db/entity/party/party-user.entity';

export interface IPartyUserRepository {
  createUser: (userId: number, partyId: number, postionId: number) => Promise<void>;
  createMaster: (userId: number, partyId: number, postionId: number) => Promise<void>;
  createEditor: (userId: number, partyId: number, postionId: number) => Promise<void>;
  findOne: (userId: number, partyId: number) => Promise<PartyUserEntity>;
}
