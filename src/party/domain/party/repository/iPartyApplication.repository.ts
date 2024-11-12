import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';

export interface IPartyApplicationRepository {
  create: (userId: number, partyId: number, message: string) => Promise<PartyApplicationEntity>;
  findOne: (partyApplicationId: number) => Promise<PartyApplicationEntity>;
  findAll: (partyId: number) => Promise<PartyApplicationEntity[]>;
  findOneWithRecruitment: (partyApplicationId: number) => Promise<PartyApplicationEntity>;
  findOneByUserIdAndPartyRecruitmentId: (userId: number, partyRecruitmentId: number) => Promise<PartyApplicationEntity>;
  update: (partyId: number, title: string, content: string) => Promise<void>;
  updateStatusApproved: (partyId: number) => Promise<void>;
  updateStatusPending: (partyId: number) => Promise<void>;
  updateStatusRejected: (partyId: number) => Promise<void>;
  softDeleteById: (partyId: number) => Promise<void>;
  deleteByUserId: (userId: number) => Promise<void>;
}
