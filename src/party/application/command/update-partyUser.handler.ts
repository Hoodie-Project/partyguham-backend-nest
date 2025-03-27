import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { UpdatePartyUserCommand } from './update-partyUser.comand';
import { NotificationService } from 'src/notification/notification.service';
import { PositionService } from 'src/position/position.service';

@Injectable()
@CommandHandler(UpdatePartyUserCommand)
export class UpdatePartyUserHandler implements ICommandHandler<UpdatePartyUserCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    private positionService: PositionService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: UpdatePartyUserCommand) {
    const { userId, partyId, partyUserId, positionId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }
    if (party.status === 'deleted') {
      throw new GoneException('삭제된 파티 입니다.', 'DELETED');
    }
    if (party.status === 'archived') {
      throw new ConflictException('완료된 파티 입니다.', 'CONFLICT');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('파티 유저 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const findPartyUser = await this.partyUserRepository.findOneWithUserData(partyUserId, partyId);

    if (!findPartyUser) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    await this.partyUserRepository.updateByPositionId(partyUserId, positionId);

    const position = await this.positionService.findById(positionId);

    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = 'party';
    const link = `party/${partyId}#PartyPeopleTab`;

    this.notificationService.createNotifications(
      partyUserIds,
      type,
      party.title,
      `${partyUser.user.nickname}님의 포지션이 ${position.main} ${position.sub}으로 변경되었어요.`,
      link,
    );
  }
}
