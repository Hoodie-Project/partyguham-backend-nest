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

    const partyRecruitment = await this.partyRecruitmentRepository.findOne(partyId);

    if (partyRecruitment.id !== partyRecruitmentId) {
      throw new BadRequestException('모집공고가 존재하지 않거나 올바르지 않습니다.');
    }

    const partyApplication = await this.partyApplicationRepository.create(userId, partyRecruitmentId, message);

    return partyApplication;
  }
}
