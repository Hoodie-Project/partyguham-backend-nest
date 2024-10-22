import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    if (!findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }
    if (findParty.status === 'deleted') {
      throw new GoneException('종료된 파티 입니다.', 'DELETED');
    }
    if (findParty.status === 'archived') {
      throw new ConflictException('완료된 파티 입니다.', 'CONFLICT');
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
