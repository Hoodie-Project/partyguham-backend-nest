import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyCommentRepository } from 'src/party/domain/party/repository/iPartyComment.repository';
import { DeleteCommentCommand } from './delete-comment.comand';

@Injectable()
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyCommentRepository') private partyCommentRepository: IPartyCommentRepository,
  ) {}

  async execute(command: DeleteCommentCommand) {
    const { commentId, userId } = command;

    const result = await this.partyCommentRepository.delete(commentId, userId);
    if (!result) {
      throw new InternalServerErrorException('삭제되지 않았습니다.');
    }
  }
}
