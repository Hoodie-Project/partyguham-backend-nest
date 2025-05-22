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
import { ApprovePartyApplicationCommand } from './approve-partyApplication.comand';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { NotificationService } from 'src/notification/notification.service';
import { FcmService } from 'src/libs/firebase/fcm.service';

@Injectable()
@CommandHandler(ApprovePartyApplicationCommand)
export class ApprovePartyApplicationHandler implements ICommandHandler<ApprovePartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    private fcmService: FcmService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: ApprovePartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);
    if (!partyApplication) {
      throw new NotFoundException('승인하려는 지원데이터가 없습니다.', 'APLLICATION_NOT_EXIST');
    }

    if (partyApplication.status !== StatusEnum.PROCESSING) {
      throw new ForbiddenException('파티장의 수락이 선행되어야 합니다.', 'ACCESS_DENIED');
    }

    if (partyApplication.userId !== userId) {
      throw new ForbiddenException('본인이 지원 데이터만 수락 가능합니다.', 'ACCESS_DENIED');
    }

    const partyUser = await this.partyUserRepository.findOneWithUserData(userId, partyId);
    if (partyUser) {
      throw new ConflictException('이미 파티유저 입니다.', 'ALREADY_EXIST');
    }

    // 수락하기(지원자 응답 대기)
    await this.partyApplicationRepository.updateStatusApproved(partyApplicationId);

    const recruiting = partyApplication.partyRecruitment.recruitingCount;
    const recruited = partyApplication.partyRecruitment.recruitedCount + 1;

    if (recruiting < recruited) {
      throw new ConflictException('모집 인원이 초과 하였습니다.', 'CONFLICT');
    }

    // 파티 모집 완료시
    if (recruiting === recruited) {
      await this.partyRecruitmentRepository.updateStatusCompleted(partyApplication.partyRecruitment.id);
    }

    await this.partyRecruitmentRepository.updateRecruitedCount(partyApplication.partyRecruitment.id, recruited);

    // 파티 소속 시키기
    await this.partyUserRepository.createMember(
      partyApplication.userId,
      partyId,
      partyApplication.partyRecruitment.positionId,
    );

    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = 'party';
    const link = `/party/${partyId}#home`;
    const title = party.title;
    const notificationMessage = `${partyUser.user.nickname}님이 새롭게 파티에 합류했어요. 함께 파티를 시작해 보세요!`;

    this.notificationService.createNotifications(partyUserIds, type, title, notificationMessage, party.image, link);

    partyUserIds.map((userId) => {
      this.fcmService.sendDataPushNotificationByUserId(userId, title, notificationMessage, type);
    });

    // 지원에 대한 삭제 보관 2주 (다른 로직에서 처리)
    // await this.partyApplicationRepository.delete(partyApplicationId);

    return { message: '합류를 최종 수락 하였습니다.' };
  }
}
