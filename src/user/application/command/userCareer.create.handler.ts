import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserCareerCreateCommand } from './userCareer.create.command';
import { PositionService } from 'src/position/position.service';
import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';
import { CareerTypeEnum } from 'src/user/infra/db/entity/user-career.entity';

@Injectable()
@CommandHandler(UserCareerCreateCommand)
export class UserCareerCreateHandler implements ICommandHandler<UserCareerCreateCommand> {
  constructor(
    @Inject('UserCareerRepository') private userCareerRepository: IUserCareerRepository,
    private readonly positionService: PositionService,
  ) {}

  async execute(command: UserCareerCreateCommand) {
    const { userId, career } = command;

    const positionIds = career.map((value) => value.positionId);

    await this.positionService.findByIds(positionIds);

    // 저장되어있는 유저 커리어 조회
    const savedUserCareer = await this.userCareerRepository.findByUserId(userId);
    let savedPrimaryPositionId: number = null;
    let savedSecondaryPositionId: number = null;

    savedUserCareer.forEach((value) => {
      if (value.careerType === CareerTypeEnum.PRIMARY) savedPrimaryPositionId = value.positionId;
      if (value.careerType === CareerTypeEnum.SECONDARY) savedSecondaryPositionId = value.positionId;
    });

    // 주, 부 포지션 데이터 검사
    career.forEach((value) => {
      if (value.careerType === CareerTypeEnum.PRIMARY && savedPrimaryPositionId) {
        throw new ConflictException(`주 포지션에 이미 데이터가 존재합니다.`);
      }

      if (value.careerType === CareerTypeEnum.SECONDARY && savedSecondaryPositionId) {
        throw new ConflictException(`부 포지션에 이미 데이터가 존재합니다.`);
      }
    });

    // 포지션 중복 검사
    career.forEach((value) => {
      if (value.positionId === savedPrimaryPositionId || value.positionId === savedSecondaryPositionId)
        throw new ConflictException('이미 저장된 포지션이 있습니다.');
    });

    const result = await this.userCareerRepository.bulkInsert(userId, career);

    return result;
  }
}
