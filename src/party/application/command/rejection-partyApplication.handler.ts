import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { RejectionPartyApplicationCommand } from './rejection-partyApplication.comand';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';

@Injectable()
@CommandHandler(RejectionPartyApplicationCommand)
export class RejectionPartyApplicationHandler implements ICommandHandler<RejectionPartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: RejectionPartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOne(partyId);

    if (!party) {
      throw new BadRequestException('모집하려고 하는 파티가 존재하지 않습니다.');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MASTER) {
      throw new UnauthorizedException('파티 모집 권한이 없습니다.');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);

    if (!partyApplication) {
      throw new NotFoundException('승인하려는 지원데이터가 없습니다.');
    }

    // 승인 취소
    await this.partyApplicationRepository.delete(partyApplicationId);
  }
}
