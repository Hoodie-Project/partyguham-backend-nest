import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';
import { Party } from '../party';
import { StatusEnum } from 'src/common/entity/baseEntity';

export interface IPartyRepository {
  create: (partyTypeId: number, title: string, content: string, image: string) => Promise<PartyEntity>;
  findOneById: (id: number) => Promise<PartyEntity>;
  updateById: (
    id: number,
    partyTypeId: number,
    title: string,
    content: string,
    image: string,
    status: StatusEnum,
  ) => Promise<void>;
  updateImageById: (id: number, image: string) => Promise<void>;
  update: (party: Party) => Promise<PartyEntity>;
  deleteById: (id: number) => Promise<void>;
  archivedById: (id: number) => Promise<void>;
  activeById: (id: number) => Promise<void>;
}
