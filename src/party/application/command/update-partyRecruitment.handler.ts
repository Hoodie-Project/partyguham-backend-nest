import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { UpdatePartyRecruitmentCommand } from './update-partyRecruitment.comand';

@Injectable()
@CommandHandler(UpdatePartyRecruitmentCommand)
export class UpdatePartyRecruitmentHandler implements ICommandHandler<UpdatePartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: UpdatePartyRecruitmentCommand) {
    const { userId, partyId, partyRecruitmentId, positionId, recruiting_count } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new ForbiddenException('파티 모집 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    await this.partyRecruitmentRepository.update(partyRecruitmentId, positionId, recruiting_count);

    const result = await this.partyRecruitmentRepository.findOne(partyRecruitmentId);

    return result;
  }
}
