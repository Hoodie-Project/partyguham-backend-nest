import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { DeletePartyUserCommand } from './delete-partyUser.comand';

@Injectable()
@CommandHandler(DeletePartyUserCommand)
export class DeletePartyUserHandler implements ICommandHandler<DeletePartyUserCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: DeletePartyUserCommand) {
    const { userId, partyId, partyUserId } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (findParty) {
      throw new NotFoundException('PARTY_NOT_EXIST', '파티를 찾을 수 없습니다.');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('ACCESS_DENIED', '파티 유저를 내보낼 권한이 없습니다.');
    }

    const deletedPartyUser = await this.partyUserRepository.findOneById(partyUserId);

    if (!deletedPartyUser) {
      throw new NotFoundException('PARTY_USER_NOT_EXIST', '파티유저를 찾을 수 없습니다.');
    }

    if (deletedPartyUser.authority === 'master') {
      throw new ForbiddenException('ACCESS_DENIED', '파티장은 내보낼 수 없습니다.');
    }

    await this.partyUserRepository.deleteById(partyId);
  }
}
