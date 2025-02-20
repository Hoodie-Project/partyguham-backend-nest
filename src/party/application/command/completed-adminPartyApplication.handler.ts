import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';

import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { CompletedAdminPartyRecruitmentCommand } from './completed-adminPartyApplication.comand';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';

@Injectable()
@CommandHandler(CompletedAdminPartyRecruitmentCommand)
export class RejectionAdminPartyApplicationHandler implements ICommandHandler<CompletedAdminPartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: CompletedAdminPartyRecruitmentCommand) {
    const { userId, partyId, partyRecuritmentId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);
    if (partyUser.authority !== PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 모집공고에 대한 완료 권한이 없습니다.', 'ACCESS_DENIED');
    }

    await this.partyRecruitmentRepository.updateStatusCompleted(partyRecuritmentId);

    return { message: '파티모집 공고를 완료 하였습니다.' };
  }
}
