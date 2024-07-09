import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { LeavePartyCommand } from './leave-party.comand';

@Injectable()
@CommandHandler(LeavePartyCommand)
export class LeavePartyHandler implements ICommandHandler<LeavePartyCommand> {
  constructor(@Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository) {}

  async execute(command: LeavePartyCommand) {
    const { userId, partyId } = command;
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'member') {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    if (partyUser) {
      throw new NotFoundException('NOT_FOUND');
    }

    await this.partyUserRepository.deleteById(partyUser.id);
  }
}
