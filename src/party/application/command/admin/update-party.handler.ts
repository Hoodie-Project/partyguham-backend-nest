import { ForbiddenException, GoneException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { UpdatePartyCommand } from './update-party.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { NotificationService } from 'src/notification/notification.service';
import { partyImageKey } from 'src/libs/aws/s3/key.util';
import { S3Service } from 'src/libs/aws/s3/s3.service';

@Injectable()
@CommandHandler(UpdatePartyCommand)
export class UpdatePartyHandler implements ICommandHandler<UpdatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private notificationService: NotificationService,
    private s3Service: S3Service,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: UpdatePartyCommand) {
    const { userId, partyId, partyTypeId, title, content, status, image } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }
    if (party.status === 'deleted') {
      throw new GoneException('삭제된 파티 입니다.', 'DELETED');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (!partyUser) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new ForbiddenException('파티 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    let imageKey: string | undefined;

    if (image) {
      imageKey = partyImageKey(party.id, image.originalname);
      await this.s3Service.uploadFile(image, imageKey);
      await this.partyRepository.updateImageById(party.id, imageKey);
      this.s3Service.deleteFile(party.image);
    }

    await this.partyRepository.updateById(partyId, partyTypeId, title, content, imageKey, status);

    // 알람
    const partyUserList = await this.partyUserRepository.findAllbByPartyId(partyId);
    const partyUserIds = partyUserList.map((list) => list.userId);
    const type = 'party';
    const link = `/party/${partyId}/#home`;

    if (status) {
      if (status === StatusEnum.ACTIVE) {
        this.notificationService.createNotifications(
          partyUserIds,
          type,
          title,
          '파티가 다시 활성화되었어요. 다시 새로운 도전을 시작해 보세요.',
          imageKey,
          link,
        );
      }
      if (status === StatusEnum.ARCHIVED) {
        this.notificationService.createNotifications(
          partyUserIds,
          type,
          title,
          '파티가 성공적으로 종료되었어요. 참여해 주셔서 감사합니다.',
          imageKey,
          link,
        );
      }
    } else {
      this.notificationService.createNotifications(
        partyUserIds,
        type,
        title,
        '파티 정보가 업데이트되었어요. 변경된 내용을 확인하세요.',
        imageKey,
        link,
      );
    }

    const result = await this.partyRepository.findOneById(partyId);

    return result;
  }
}
