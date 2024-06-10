import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { RecruitmentDto } from 'src/party/interface/dto/recruitmentDto';

export interface IPartyRecruitmentRepository {
  create: (partyId: number, positionId: number, capacity: number) => Promise<PartyRecruitmentEntity>;
  bulkInsert: (partyId: number, recruitment: RecruitmentDto[]) => Promise<PartyRecruitmentEntity[]>;
  findOne: (partyId: number) => Promise<PartyRecruitmentEntity>;
  findAll: (partyId: number) => Promise<PartyRecruitmentEntity[]>;
  update: (partyId: number, title: string, content: string) => Promise<void>;
  delete: (partyId: number) => Promise<void>;
}
