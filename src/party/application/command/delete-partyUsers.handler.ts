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
import { DeletePartyUsersCommand } from './delete-partyUsers.comand';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
@CommandHandler(DeletePartyUsersCommand)
export class DeletePartyUsersHandler implements ICommandHandler<DeletePartyUsersCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: DeletePartyUsersCommand) {
    const { userId, partyId, partyUserIds } = command;

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
      throw new ForbiddenException('파티 유저를 내보낼 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const deletedPartyUsers = await this.partyUserRepository.findByIdsWithUserData(partyUserIds);

    if (deletedPartyUsers.length === 0) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    deletedPartyUsers.map((deletedPartyUser) => {
      if (deletedPartyUser.authority === 'master') {
        throw new ForbiddenException('파티장은 내보낼 수 없습니다.', 'ACCESS_DENIED');
      }
    });

    await this.partyUserRepository.batchDelete(partyUserIds);

    deletedPartyUsers.map(async (deletedPartyUser) => {
      const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
      const partyUserIds = partyUserList.map((list) => list.userId);
      const type = 'party';
      const link = `/party/${partyId}#PartyPeopleTab`;

      this.notificationService.createNotifications(
        partyUserIds,
        type,
        party.title,
        `${deletedPartyUser.user.nickname}님이 파티에서 제외되었습니다.`,
        party.image,
        link,
      );
    });

    return;
  }
}
