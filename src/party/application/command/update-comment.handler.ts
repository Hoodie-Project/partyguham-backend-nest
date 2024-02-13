import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyCommentRepository } from 'src/party/domain/party/repository/iPartyComment.repository';
import { UpdateCommentCommand } from './update-comment.comand';

@Injectable()
@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyCommentRepository') private partyCommentRepository: IPartyCommentRepository,
  ) {}

  async execute(command: UpdateCommentCommand) {
    const { commentId, userId, comment } = command;

    const result = await this.partyCommentRepository.update(commentId, userId, comment);

    return result;
  }
}
