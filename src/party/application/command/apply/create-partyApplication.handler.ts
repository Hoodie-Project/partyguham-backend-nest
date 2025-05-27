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
import { NotificationService } from 'src/notification/notification.service';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { UserService } from 'src/user/application/user.service';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { FcmService } from 'src/libs/firebase/fcm.service';

@Injectable()
@CommandHandler(CreatePartyApplicationCommand)
export class CreatePartyApplicationHandler implements ICommandHandler<CreatePartyApplicationCommand> {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private fcmService: FcmService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
    @Inject('PartyApplicationRepository') private partyApplicationRepository: IPartyApplicationRepository,
  ) {}

  async execute(command: CreatePartyApplicationCommand) {
    const { userId, partyId, partyRecruitmentId, message } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

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

    // 지원한 유저에게 알람 비동기 처리
    const partyMaster = await this.partyUserRepository.findOneMasterByPartyId(partyId);
    const nickname = (await this.userService.findByIdWithoutDeleted(userId)).nickname;
    const type = 'recruit';
    const link = `/party/setting/applicant/${partyId}`;
    const title = party.title;
    const notificationMessage = `${nickname}님이 지원했어요. 지원서를 검토해 보세요.`;

    // 알람
    this.notificationService.createNotification(
      partyMaster.userId,
      type,
      title,
      notificationMessage,
      party.image,
      link,
    );

    // 푸쉬 알람
    this.fcmService.sendDataPushNotificationByUserId(partyMaster.userId, title, notificationMessage, type);

    return partyApplication;
  }
}
