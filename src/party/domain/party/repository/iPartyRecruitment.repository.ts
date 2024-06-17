import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { RecruitmentDto } from 'src/party/interface/dto/recruitmentDto';

export interface IPartyRecruitmentRepository {
  create: (partyId: number, positionId: number, capacity: number) => Promise<PartyRecruitmentEntity>;
  bulkInsert: (partyId: number, recruitment: RecruitmentDto[]) => Promise<PartyRecruitmentEntity[]>;
  findOne: (id: number) => Promise<PartyRecruitmentEntity>;
  findAllByPartyId: (partyId: number) => Promise<PartyRecruitmentEntity[]>;
  update: (id: number, positionId: number, recruitingCount: number) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
