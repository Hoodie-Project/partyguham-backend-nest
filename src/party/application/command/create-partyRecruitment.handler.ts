import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { CreatePartyRecruitmentCommand } from './create-partyRecruitment.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';

@Injectable()
@CommandHandler(CreatePartyRecruitmentCommand)
export class CreatePartyRecruitmentHandler implements ICommandHandler<CreatePartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyTypeRepository: IPartyTypeRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: CreatePartyRecruitmentCommand) {
    const { userId, partyId, recruitment } = command;

    const party = await this.partyRepository.findOne(partyId);

    if (!party) {
      throw new BadRequestException('모집하려고 하는 파티가 존재하지 않습니다.');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new UnauthorizedException('파티 모집 권한이 없습니다.');
    }

    const partyRecruitment = await this.partyRecruitmentRepository.bulkInsert(partyId, recruitment);

    return partyRecruitment;
  }
}
