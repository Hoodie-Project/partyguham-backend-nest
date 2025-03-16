import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';

export interface IPartyUserRepository {
  count: (partyId: number) => Promise<number>;
  createMember: (userId: number, partyId: number, positionId: number) => Promise<void>;
  createMaster: (userId: number, partyId: number, positionId: number) => Promise<void>;
  createDeputy: (userId: number, partyId: number, positionId: number) => Promise<void>;
  updateMember: (id: number) => Promise<void>;
  updateMaster: (id: number) => Promise<void>;
  updateDeputy: (id: number) => Promise<void>;
  updateByPositionId: (id: number, positionId: number) => Promise<PartyUserEntity>;
  findOneById: (id: number) => Promise<PartyUserEntity>;
  findAllbByPartyId: (partyId: number) => Promise<PartyUserEntity[]>;
  findMasterByUserId: (userId: number) => Promise<PartyUserEntity[]>;
  findByIds: (id: number[]) => Promise<PartyUserEntity[]>;
  findOne: (userId: number, partyId: number) => Promise<PartyUserEntity>;
  deleteById: (id: number) => Promise<void>;
  softDeleteById: (id: number) => Promise<void>;
  batchDelete: (id: number[]) => Promise<void>;
}
