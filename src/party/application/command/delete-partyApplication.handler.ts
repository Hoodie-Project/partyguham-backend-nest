import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';

import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { DeletePartyApplicationCommand } from './delete-partyApplication.comand';

@Injectable()
@CommandHandler(DeletePartyApplicationCommand)
export class DeletePartyApplicationHandler implements ICommandHandler<DeletePartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
  ) {}

  async execute(command: DeletePartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOne(partyId);

    if (!party) {
      throw new NotFoundException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);
    if (!partyApplication) {
      throw new NotFoundException('삭제 하려는 파티 지원자 데이터가 없습니다.', 'PARTY_APPLICATION_NOT_EXIST');
    }

    if (partyApplication.userId !== userId) {
      throw new ForbiddenException('본인이 지원 데이터만 취소 가능합니다.', 'ACCESS_DENIED');
    }

    await this.partyApplicationRepository.deleteById(partyApplicationId);
  }
}
