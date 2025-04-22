import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePartyCommand } from './create-party.comand';
import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { ImageService } from 'src/libs/image/image.service';

@Injectable()
@CommandHandler(CreatePartyCommand)
export class CreatePartyHandler implements ICommandHandler<CreatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    private imageService: ImageService,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyTypeRepository: IPartyTypeRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: CreatePartyCommand) {
    const { userId, title, content, imagePath, partyTypeId, positionId } = command;

    const partyType = await this.partyTypeRepository.findOne(partyTypeId);
    if (!partyType) {
      throw new NotFoundException('Party Type이 존재하지 않습니다.', 'NOT_FOUND');
    }

    const savedImagePath = this.imageService.getRelativePath(imagePath);

    const party = await this.partyRepository.create(partyTypeId, title, content, savedImagePath);

    await this.partyUserRepository.createMaster(userId, party.id, positionId);

    return party;
  }
}
