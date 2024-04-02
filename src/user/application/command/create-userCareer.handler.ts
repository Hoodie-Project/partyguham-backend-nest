import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserCareerCommand } from './create-userCareer.command';
import { PositionService } from 'src/position/position.service';
import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';
import { CareerTypeEnum } from 'src/user/infra/db/entity/user-career.entity';

@Injectable()
@CommandHandler(CreateUserCareerCommand)
export class CreateUserCareerHandler implements ICommandHandler<CreateUserCareerCommand> {
  constructor(
    @Inject('UserCareerRepository') private userCareerRepository: IUserCareerRepository,
    private readonly positionService: PositionService,
  ) {}

  async execute(command: CreateUserCareerCommand) {
    const { userId, positionId, years, careerType } = command;

    const findPositionId = await this.positionService.findById(positionId);
    if (!findPositionId) throw new BadRequestException('positionId가 유효하지 않습니다.');

    // 저장되어있는 유저 커리어 조회
    const userCareer = await this.userCareerRepository.findByUserId(userId);
    let primary = null;
    let secondary = null;
    let other = [];

    userCareer.forEach((value) => {
      if (value.careerType === CareerTypeEnum.PRIMARY) primary = value.positionId;
      if (value.careerType === CareerTypeEnum.SECONDARY) secondary = value.positionId;
      if (value.careerType === CareerTypeEnum.OTHER) other.push(value.positionId);
    });

    if ((careerType === CareerTypeEnum.PRIMARY && primary) || (careerType === CareerTypeEnum.SECONDARY && secondary)) {
      throw new ConflictException(`해당 포지션에 이미 데이터가 존재합니다.`);
    }

    if (careerType === CareerTypeEnum.OTHER && other.length === 3) {
      throw new ConflictException(`기타 포지션은 3개 초과하여 저장할 수 없습니다.`);
    }

    // 중복 검사
    let userPositionIds = [primary, secondary, ...other];

    userPositionIds.forEach((value) => {
      if (value === positionId) throw new ConflictException('포지션 중에 이미 저장되어있습니다.');
    });

    const result = await this.userCareerRepository.createCareer(userId, positionId, years, careerType);

    return result;
  }
}
