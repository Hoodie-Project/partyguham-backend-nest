import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { ApproveAdminPartyApplicationCommand } from './approve-adminPartyApplication.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
@CommandHandler(ApproveAdminPartyApplicationCommand)
export class ApproveAdminPartyApplicationHandler implements ICommandHandler<ApproveAdminPartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: ApproveAdminPartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 지원자에 대한 수락 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);

    if (!partyApplication) {
      throw new NotFoundException('승인하려는 지원데이터가 없습니다.', 'APLLICATION_NOT_EXIST');
    }

    // 수락하기
    await this.partyApplicationRepository.updateStatusProcessing(partyApplicationId);

    // 지원한 유저에게 알람 가기
    const applicationUser = await this.partyApplicationRepository.findOneByIdWithUserData(partyApplicationId);
    const type = 'recruit';
    const link = `/my/apply`;
    this.notificationService.createNotification(
      applicationUser.userId,
      type,
      party.title,
      `${applicationUser.user.nickname}님의 지원이 수락되었어요. 합류 여부를 결정해 주세요.`,
      party.image,
      link,
    );

    return { message: '지원자를 수락 하였습니다.' };
  }
}
