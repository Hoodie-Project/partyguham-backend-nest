import { ForbiddenException, GoneException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { EndPartyCommand } from './end-party.comand';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';

@Injectable()
@CommandHandler(EndPartyCommand)
export class EndPartyHandler implements ICommandHandler<EndPartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: EndPartyCommand) {
    const { userId, partyId } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (!findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }
    if (findParty.status === 'deleted') {
      throw new GoneException('종료된 파티 입니다.', 'DELETED');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('파티 종료 권한이 없습니다.', 'ACCESS_DENIED');
    }

    await this.partyRecruitmentRepository.deleteAll(partyId);
    await this.partyRepository.archivedById(partyId);
  }
}
