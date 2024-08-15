import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { UpdatePartyUserCommand } from './update-partyUser.comand';

@Injectable()
@CommandHandler(UpdatePartyUserCommand)
export class UpdatePartyUserHandler implements ICommandHandler<UpdatePartyUserCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: UpdatePartyUserCommand) {
    const { userId, partyId, partyUserId, positionId } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (findParty) {
      throw new NotFoundException('파티를 찾을 수 없습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('파티 유저 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const findPartyUser = await this.partyUserRepository.findOneById(partyUserId);

    if (!findPartyUser) {
      throw new NotFoundException('파티유저를 찾을 수 없습니다.', 'PARTY_USER_NOT_EXIST');
    }

    await this.partyUserRepository.updateByPositionId(partyUserId, positionId);
  }
}
