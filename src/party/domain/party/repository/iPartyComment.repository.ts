import { PartyCommentEntity } from 'src/party/infra/db/entity/party/party-comment.entity';

export interface IPartyCommentRepository {
  create: (userId: number, partyId: number, comment: string) => Promise<void>;
  update: (commentId: number, userId: number, comment: string) => Promise<void>;
  delete: (commentId: number, userId: number) => Promise<boolean>;
  findOne: (commandId: number, userId: number) => Promise<PartyCommentEntity>;
}
