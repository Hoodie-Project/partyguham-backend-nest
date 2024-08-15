import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { ApprovePartyApplicationCommand } from './approve-partyApplication.comand';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';

@Injectable()
@CommandHandler(ApprovePartyApplicationCommand)
export class ApprovePartyApplicationHandler implements ICommandHandler<ApprovePartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: ApprovePartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOne(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 유효하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 모집 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);

    if (!partyApplication) {
      throw new NotFoundException('승인하려는 지원데이터가 없습니다.', 'APLLICATION_NOT_EXIST');
    }

    // 파티 소속 시키기
    await this.partyUserRepository.createMember(
      partyApplication.userId,
      partyId,
      partyApplication.partyRecruitment.positionId,
    );

    // 모집 카운트 + 1
    await this.partyRecruitmentRepository.updateRecruitedCount(
      partyApplication.partyRecruitment.id,
      partyApplication.partyRecruitment.recruitingCount + 1,
    );

    await this.partyApplicationRepository.delete(partyApplicationId);

    // 파티 모집 완료시 자동삭제
    if (partyApplication.partyRecruitment.recruitingCount + 1 === partyApplication.partyRecruitment.recruitedCount)
      this.partyRecruitmentRepository.delete(partyApplication.partyRecruitment.id);
    return '모집이 완료되어 해당 포지션 모집이 삭제 되었습니다.';
  }
}
