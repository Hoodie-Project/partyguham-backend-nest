import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { DeletePartyCommand } from './delete-party.comand';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { NotificationService } from 'src/notification/notification.service';
import { FcmService } from 'src/libs/firebase/fcm.service';

@Injectable()
@CommandHandler(DeletePartyCommand)
export class DeletePartyHandler implements ICommandHandler<DeletePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    private fcmService: FcmService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: DeletePartyCommand) {
    const { userId, partyId } = command;

    const findParty = await this.partyRepository.findOneById(partyId);

    if (!findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('파티 삭제 권한이 없습니다.', 'ACCESS_DENIED');
    }

    await this.partyRecruitmentRepository.deleteAll(partyId);
    await this.partyRepository.deleteById(partyId);

    // 알람
    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = 'party';
    const link = null;
    const title = findParty.title;
    const notificationMessage = `파티가 삭제되었어요. 다시 새로운 도전을 시작해보세요.`;

    this.notificationService.createNotifications(partyUserIds, type, title, notificationMessage, null, link);

    partyUserIds.map((userId) => {
      this.fcmService.sendDataPushNotificationByUserId(userId, title, notificationMessage, type);
    });
  }
}
