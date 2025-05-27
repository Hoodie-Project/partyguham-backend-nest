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
import { IPartyTypeRepository } from 'src/party/domain/party/repository/iPartyType.repository';
import { CreatePartyRecruitmentCommand } from './create-partyRecruitment.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';

@Injectable()
@CommandHandler(CreatePartyRecruitmentCommand)
export class CreatePartyRecruitmentHandler implements ICommandHandler<CreatePartyRecruitmentCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: CreatePartyRecruitmentCommand) {
    const { userId, partyId, positionId, content, recruiting_count } = command;

    const party = await this.partyRepository.findOneById(partyId);

    if (!party) {
      throw new BadRequestException('모집하려고 하는 파티가 존재하지 않습니다.', 'PARTY_NOT_EXIST');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new UnauthorizedException('파티 모집 권한이 없습니다.', 'ACCESS_DENIED');
    }

    const partyUserCount = await this.partyUserRepository.count(partyId);
    const partyRecruitment = await this.partyRecruitmentRepository.findAllByPartyId(partyId);

    let recruitingCount = partyRecruitment.reduce(
      (acc, value) => acc + value.recruitingCount - value.recruitedCount,
      0,
    );

    if (partyUserCount + recruiting_count + recruitingCount > 17) {
      throw new ForbiddenException('파티 모집 인원이 16명 초과되는 모집을 생성 할 수 없습니다.', 'LIMIT_EXCEEDED');
    }

    const result = await this.partyRecruitmentRepository.create(partyId, positionId, content, recruiting_count);

    return result;
  }
}
