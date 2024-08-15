import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { LeavePartyCommand } from './leave-party.comand';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';

@Injectable()
@CommandHandler(LeavePartyCommand)
export class LeavePartyHandler implements ICommandHandler<LeavePartyCommand> {
  constructor(
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: LeavePartyCommand) {
    const { userId, partyId } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === 'master') {
      throw new ForbiddenException('파티장은 파티를 나갈 수 없습니다.', 'FORBIDDEN');
    }

    if (partyUser) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER__NOT_EXIST');
    }

    await this.partyUserRepository.deleteById(partyUser.id);
  }
}
