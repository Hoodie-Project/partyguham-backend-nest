import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';

import { CompletedAdminPartyRecruitmentCommand } from './completed-adminPartyRecruitment.comand';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { NotificationService } from 'src/notification/notification.service';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { FcmService } from 'src/libs/firebase/fcm.service';

@Injectable()
@CommandHandler(CompletedAdminPartyRecruitmentCommand)
export class CompletedAdminPartyRecruitmentHandler implements ICommandHandler<CompletedAdminPartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    private fcmService: FcmService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
  ) {}

  async execute(command: CompletedAdminPartyRecruitmentCommand) {
    const { userId, partyId, partyRecruitmentId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);
    if (partyUser.authority !== PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 모집공고에 대한 완료 권한이 없습니다.', 'ACCESS_DENIED');
    }

    await this.partyRecruitmentRepository.updateStatusCompleted(partyRecruitmentId);

    const partyUserList = await this.partyApplicationRepository.findAllByPartyRecruitmentId(partyRecruitmentId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = 'recruit';
    const link = `/my/apply`;
    const title = party.title;
    const notificationMessage = `지원하신 파티 모집공고가 마감되었습니다. `;

    this.notificationService.createNotifications(partyUserIds, type, title, notificationMessage, party.image, link);

    partyUserIds.map((userId) => {
      this.fcmService.sendDataPushNotificationByUserId(userId, title, notificationMessage, type);
    });

    return { message: '파티모집 공고를 완료 하였습니다.' };
  }
}
