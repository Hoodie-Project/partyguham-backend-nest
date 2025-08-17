import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePartyCommand } from './create-party.comand';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { S3Service } from 'src/libs/aws/s3/s3.service';
import { partyImageKey } from 'src/libs/aws/s3/key.util';

@Injectable()
@CommandHandler(CreatePartyCommand)
export class CreatePartyHandler implements ICommandHandler<CreatePartyCommand> {
  constructor(
    private s3Service: S3Service,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyTypeRepository: IPartyTypeRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: CreatePartyCommand) {
    const { userId, title, content, partyTypeId, positionId, image } = command;

    const partyType = await this.partyTypeRepository.findOne(partyTypeId);
    if (!partyType) {
      throw new NotFoundException('Party Type이 존재하지 않습니다.', 'NOT_FOUND');
    }

    const party = await this.partyRepository.create(partyTypeId, title, content, null);

    let key: string | undefined;

    if (image) {
      key = partyImageKey(party.id, image.originalname);
      await this.s3Service.uploadFile(image, key);
      this.partyRepository.updateImageById(party.id, key);
      party.image = key; // 반환값에 포함되도록 갱신
    }

    await this.partyUserRepository.createMaster(userId, party.id, positionId);

    return party;
  }
}
