import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { DeletePartyImageCommand } from './delete-partyImage.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { promises as fs } from 'fs';
import { PartyFactory } from 'src/party/domain/party/party.factory';

@Injectable()
@CommandHandler(DeletePartyImageCommand)
export class DeletePartyImageHandler implements ICommandHandler<DeletePartyImageCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: DeletePartyImageCommand) {
    const { userId, partyId } = command;

    const findParty = await this.partyRepository.findOneById(partyId);

    if (!findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (!partyUser) {
      throw new NotFoundException('파티 유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new UnauthorizedException('파티 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const party = this.partyFactory.create(findParty);

    if (!party.image) {
      throw new BadRequestException('파티 이미지가 없습니다.', 'PARTY_IMAGE_NOT_EXIST');
    } else {
      await fs.unlink(party.image);
    }

    const image = null;
    party.updateImage(image);

    const result = await this.partyRepository.update(party);

    return result;
  }
}
