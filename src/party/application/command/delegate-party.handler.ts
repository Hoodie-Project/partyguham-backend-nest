import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';

import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { DelegatePartyCommand } from './delegate-party.comand';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
@CommandHandler(DelegatePartyCommand)
export class DelegatePartyApplicationHandler implements ICommandHandler<DelegatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: DelegatePartyCommand) {
    const { userId, partyId, partyUserId } = command;

    const findParty = await this.partyRepository.findOneById(partyId);

    if (!findParty) {
      throw new BadRequestException('요청한 파티가 유효하지 않습니다.', 'PARTY_NOT_EXIST');
    }
    if (findParty.status === 'deleted') {
      throw new GoneException('삭제된 파티 입니다.', 'DELETED');
    }
    if (findParty.status === 'archived') {
      throw new ConflictException('완료된 파티 입니다.', 'CONFLICT');
    }

    // 파티장만 승인 가능
    const partyUserMaster = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUserMaster.authority !== PartyAuthority.MASTER) {
      throw new ForbiddenException('파티장 위임 권한이 없습니다.', 'ACCESS_DENIED');
    }

    // 파티원 존재하는지에 대한 여부
    const partyUserMember = await this.partyUserRepository.findOneWithUserData(partyUserId, partyId);

    if (!partyUserMember) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }
    if (partyUserMember.authority === PartyAuthority.MASTER) {
      throw new ConflictException('위임하려는 유저 직책은 이미 파티장 입니다.', 'CONFLICT');
    }

    // 권한 변경
    const master = await this.partyUserRepository.updateMember(partyUserMaster.id);
    const member = await this.partyUserRepository.updateMaster(partyUserId);

    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = '파티활동';
    const link = `party/${partyId}#home`;

    this.notificationService.createNotifications(
      partyUserIds,
      type,
      `파티장이 ${partyUserMember.user.nickname}님으로 변경되었어요.`,
      link,
    );

    return { master, member };
  }
}
