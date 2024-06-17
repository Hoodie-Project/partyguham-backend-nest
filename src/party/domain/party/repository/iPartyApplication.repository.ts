import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';

export interface IPartyApplicationRepository {
  create: (userId: number, partyId: number, message: string) => Promise<PartyApplicationEntity>;
  findOne: (partyId: number) => Promise<PartyApplicationEntity>;
  findAll: (partyId: number) => Promise<PartyApplicationEntity[]>;
  findOneByUserIdAndPartyRecruitmentId: (userId: number, partyRecruitmentId: number) => Promise<PartyApplicationEntity>;
  update: (partyId: number, title: string, content: string) => Promise<void>;
  delete: (partyId: number) => Promise<void>;
}
