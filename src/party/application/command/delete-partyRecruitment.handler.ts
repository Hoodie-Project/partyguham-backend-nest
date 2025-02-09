import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { DeletePartyRecruitmentCommand } from './delete-partyRecruitment.comand';

@Injectable()
@CommandHandler(DeletePartyRecruitmentCommand)
export class DeletePartyRecruitmentHandler implements ICommandHandler<DeletePartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: DeletePartyRecruitmentCommand) {
    const { userId, partyId, partyRecruitmentId } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new ForbiddenException('파티 모집 수정 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const partyRecruitment = await this.partyRecruitmentRepository.delete(partyRecruitmentId);
  }
}
