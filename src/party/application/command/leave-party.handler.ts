import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { LeavePartyCommand } from './leave-party.comand';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
@CommandHandler(LeavePartyCommand)
export class LeavePartyHandler implements ICommandHandler<LeavePartyCommand> {
  constructor(
    private notificationService: NotificationService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: LeavePartyCommand) {
    const { userId, partyId } = command;

    const findParty = await this.partyRepository.findOneById(partyId);

    if (!findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }
    if (findParty.status === 'deleted') {
      throw new GoneException('삭제된 파티 입니다.', 'DELETED');
    }
    if (findParty.status === 'archived') {
      throw new ConflictException('완료된 파티 입니다.', 'CONFLICT');
    }

    const partyUser = await this.partyUserRepository.findOneWithUserData(userId, partyId);

    if (partyUser.authority === 'master') {
      throw new ForbiddenException('파티장은 파티를 나갈 수 없습니다.', 'FORBIDDEN');
    }

    if (partyUser) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER__NOT_EXIST');
    }

    await this.partyUserRepository.deleteById(partyUser.id);

    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = '파티활동';
    const link = `party/${partyId}#PartyPeopleTab`;

    this.notificationService.createNotifications(
      partyUserIds,
      type,
      `${partyUser.user.nickname}님이 파티에서 탈퇴했어요.`,
      link,
    );
  }
}
