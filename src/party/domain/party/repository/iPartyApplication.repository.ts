import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';

export interface IPartyApplicationRepository {
  createStatusPending: (userId: number, partyId: number, message: string) => Promise<PartyApplicationEntity>;
  findOne: (partyApplicationId: number) => Promise<PartyApplicationEntity>;
  findOneByIdWithUserData: (partyApplicationId: number) => Promise<PartyApplicationEntity>;
  findAll: (id: number) => Promise<PartyApplicationEntity[]>;
  findAllByPartyRecruitmentId: (RecruitmentId: number) => Promise<PartyApplicationEntity[]>;
  findOneWithRecruitment: (partyApplicationId: number) => Promise<PartyApplicationEntity>;
  findOneByUserIdAndPartyRecruitmentId: (userId: number, partyRecruitmentId: number) => Promise<PartyApplicationEntity>;
  update: (id: number, title: string, content: string) => Promise<void>;
  updateStatusProcessing: (id: number) => Promise<void>;
  updateStatusApproved: (id: number) => Promise<void>;
  updateStatusRejected: (id: number) => Promise<void>;
  softDeleteById: (id: number) => Promise<void>;
  deleteById: (id: number) => Promise<void>;
  deleteByUserId: (userId: number) => Promise<void>;
}
