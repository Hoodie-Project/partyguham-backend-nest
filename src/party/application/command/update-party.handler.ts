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
import { UpdatePartyCommand } from './update-party.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
@CommandHandler(UpdatePartyCommand)
export class UpdatePartyHandler implements ICommandHandler<UpdatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: UpdatePartyCommand) {
    const { userId, partyId, partyTypeId, title, content, image, status } = command;

    const findParty = await this.partyRepository.findOneById(partyId);

    if (!findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }
    if (findParty.status === 'deleted') {
      throw new GoneException('삭제된 파티 입니다.', 'DELETED');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (!partyUser) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new ForbiddenException('파티 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    await this.partyRepository.updateById(partyId, partyTypeId, title, content, image, status);

    // 알람
    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = '파티활동';
    const link = `party/${partyId}/#home`;

    if (status) {
      if (status === StatusEnum.ACTIVE) {
        this.notificationService.createNotifications(
          partyUserIds,
          type,
          '파티가 다시 활성화되었어요. 다시 새로운 도전을 시작해 보세요.',
          link,
        );
      }
      if (status === StatusEnum.ARCHIVED) {
        this.notificationService.createNotifications(
          partyUserIds,
          type,
          '파티가 성공적으로 종료되었어요. 참여해 주셔서 감사합니다.',
          link,
        );
      }
    } else {
      this.notificationService.createNotifications(
        partyUserIds,
        type,
        '파티 정보가 업데이트되었어요. 변경된 내용을 확인하세요.',
        link,
      );
    }

    const result = await this.partyRepository.findOneById(partyId);

    return result;
  }
}
