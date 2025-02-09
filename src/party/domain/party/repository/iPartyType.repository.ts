import { PartyTypeEntity } from 'src/party/infra/db/entity/party/party_type.entity';

export interface IPartyTypeRepository {
  findOne: (partyTypeId: number) => Promise<PartyTypeEntity>;
  findAll: () => Promise<PartyTypeEntity[]>;
}
