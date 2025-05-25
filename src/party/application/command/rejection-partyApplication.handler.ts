import {
  BadRequestException,
  ConflictException,
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
import { RejectionPartyApplicationCommand } from './rejection-partyApplication.comand';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { UserService } from 'src/user/application/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { FcmService } from 'src/libs/firebase/fcm.service';

@Injectable()
@CommandHandler(RejectionPartyApplicationCommand)
export class RejectionPartyApplicationHandler implements ICommandHandler<RejectionPartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private userService: UserService,
    private notificationService: NotificationService,
    private fcmService: FcmService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: RejectionPartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new NotFoundException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);
    if (!partyApplication) {
      throw new NotFoundException('거절 하려는 파티 지원자 데이터가 없습니다.', 'PARTY_APPLICATION_NOT_EXIST');
    }

    if (partyApplication.status !== StatusEnum.PROCESSING) {
      throw new ForbiddenException('파티장의 수락이 선행되어야 합니다.', 'ACCESS_DENIED');
    }

    if (partyApplication.userId !== userId) {
      throw new ForbiddenException('본인이 지원 데이터만 거절 가능합니다.', 'ACCESS_DENIED');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);
    if (partyUser) {
      throw new ConflictException('이미 파티유저 입니다.', 'ALREADY_EXIST');
    }

    await this.partyApplicationRepository.updateStatusRejected(partyApplicationId);

    // 지원한 유저에게 알람 가기
    const partyMaster = await this.partyUserRepository.findOneMasterByPartyId(partyId);
    const nickname = (await this.userService.findByIdWithoutDeleted(userId)).nickname;
    const type = 'recruit';
    const link = `/party/setting/applicant/${partyId}`;
    const title = party.title;
    const notificationMessage = `${nickname}님이 파티 합류를 거절했어요. 다른 지원자를 확인해 보세요.`;

    this.notificationService.createNotification(
      partyMaster.userId,
      type,
      title,
      notificationMessage,
      party.image,
      link,
    );

    this.fcmService.sendDataPushNotificationByUserId(userId, title, notificationMessage, type);

    return { message: '지원을 거절 하였습니다.' };
  }
}
