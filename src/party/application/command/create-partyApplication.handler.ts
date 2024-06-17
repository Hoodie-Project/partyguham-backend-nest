import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePartyApplicationCommand } from './create-partyApplication.comand';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';

@Injectable()
@CommandHandler(CreatePartyApplicationCommand)
export class CreatePartyApplicationHandler implements ICommandHandler<CreatePartyApplicationCommand> {
  constructor(
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
  ) {}

  async execute(command: CreatePartyApplicationCommand) {
    const { userId, partyId, partyRecruitmentId, message } = command;

    const partyRecruitment = await this.partyRecruitmentRepository.findOne(partyRecruitmentId);

    if (!partyRecruitment || partyRecruitment.partyId !== partyId) {
      throw new BadRequestException('모집공고가 존재하지 않거나 올바르지 않습니다.');
    }

    const findPartyRecruitment = await this.partyApplicationRepository.findOneByUserIdAndPartyRecruitmentId(
      userId,
      partyRecruitmentId,
    );

    if (findPartyRecruitment) {
      throw new BadRequestException('이미 지원신청을 완료 했습니다.');
    }

    const partyApplication = await this.partyApplicationRepository.create(userId, partyRecruitmentId, message);

    return partyApplication;
  }
}
