import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    if (!partyRecruitment) {
      throw new NotFoundException('모집공고가 존재하지 않습니다.', 'RECRUITMENT_NOT_EXIST');
    }

    if (partyRecruitment.partyId !== partyId) {
      throw new ForbiddenException('모집공고 요청이 올바르지 않습니다.', 'FORBIDDEN');
    }

    const findPartyRecruitment = await this.partyApplicationRepository.findOneByUserIdAndPartyRecruitmentId(
      userId,
      partyRecruitmentId,
    );

    if (findPartyRecruitment) {
      throw new ConflictException('이미 지원신청을 완료 했습니다.', 'ALREADY_EXIST');
    }

    const partyApplication = await this.partyApplicationRepository.createStatusPending(
      userId,
      partyRecruitmentId,
      message,
    );

    return partyApplication;
  }
}
