import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';

import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { RejectionAdminPartyApplicationCommand } from './rejection-adminPartyApplication.comand';
import { NotificationService } from 'src/notification/notification.service';
import { FcmService } from 'src/libs/firebase/fcm.service';

@Injectable()
@CommandHandler(RejectionAdminPartyApplicationCommand)
export class RejectionAdminPartyApplicationHandler implements ICommandHandler<RejectionAdminPartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    private fcmService: FcmService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: RejectionAdminPartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);
    if (partyUser.authority !== PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 자원자에 대한 거절 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);

    if (!partyApplication) {
      throw new NotFoundException('거절 하려는 파티 지원자 데이터가 없습니다.', 'PARTY_APPLICATION_NOT_EXIST');
    }

    await this.partyApplicationRepository.updateStatusRejected(partyApplicationId);

    // 지원한 유저에게 알람 가기
    const applicationUser = await this.partyApplicationRepository.findOneByIdWithUserData(partyApplicationId);
    const type = 'recruit';
    const link = `/my/apply`;
    const title = party.title;
    const notificationMessage = `${applicationUser.user.nickname}님의 지원이 거절되었어요.`;

    this.notificationService.createNotification(
      applicationUser.userId,
      type,
      title,
      notificationMessage,
      party.image,
      link,
    );

    this.fcmService.sendDataPushNotificationByUserId(userId, title, notificationMessage, type);

    return { message: '지원자를 거절 하였습니다.' };
  }
}
