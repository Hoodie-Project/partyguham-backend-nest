import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './create-comment.comand';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyCommentRepository } from 'src/party/domain/party/repository/iPartyComment.repository';

@Injectable()
@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyCommentRepository') private partyCommentRepository: IPartyCommentRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const { userId, partyId, comment } = command;

    const party = await this.partyCommentRepository.create(userId, partyId, comment);

    return party;
  }
}
