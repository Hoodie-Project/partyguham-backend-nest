import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

export interface IPartyUserRepository {
  count: (partyId: number) => Promise<number>;
  createMember: (userId: number, partyId: number, positionId: number) => Promise<void>;
  createMaster: (userId: number, partyId: number, positionId: number) => Promise<void>;
  createDeputy: (userId: number, partyId: number, positionId: number) => Promise<void>;
  updateByPositionId: (id: number, positionId: number) => Promise<PartyUserEntity>;
  findOneById: (id: number) => Promise<PartyUserEntity>;
  findOne: (userId: number, partyId: number) => Promise<PartyUserEntity>;
  deleteById: (id: number) => Promise<void>;
}
