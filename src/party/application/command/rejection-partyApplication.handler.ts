import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { RejectionPartyApplicationCommand } from './rejection-partyApplication.comand';
import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';

@Injectable()
@CommandHandler(RejectionPartyApplicationCommand)
export class RejectionPartyApplicationHandler implements ICommandHandler<RejectionPartyApplicationCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: RejectionPartyApplicationCommand) {
    const { userId, partyId, partyApplicationId } = command;

    const party = await this.partyRepository.findOne(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 자원자에 대한 거절 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(partyApplicationId);

    if (!partyApplication) {
      throw new NotFoundException('거절 하려는 파티 지원자 데이터가 없습니다.', 'PARTY_APPLICATION_NOT_EXIST');
    }

    await this.partyApplicationRepository.updateStatusRejected(partyApplicationId);

    return { message: '지원자를 거절 하였습니다.' };
  }
}
