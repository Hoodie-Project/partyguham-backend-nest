import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
    const { userId, primary, secondary, other } = command;

    const userCareer = await this.userCareerRepository.findByUserId(userId);

    if (userCareer) {
      throw new BadRequestException(`이미 저장 완료 되었습니다.`);
    }

    // positionId 통합
    const checkPostionIds = [primary.positionId];
    const careerTypes = [CareerTypeEnum.PRIMARY];
    if (secondary) {
      careerTypes.push(CareerTypeEnum.SECONDARY);
      checkPostionIds.push(secondary.positionId);
    }
    if (other) {
      other.map((position) => checkPostionIds.push(position.positionId), careerTypes.push(CareerTypeEnum.OTHER));
    }

    // 중복 검사
    const uniqueSet = new Set(checkPostionIds);
    const isDuplicate = checkPostionIds.length !== uniqueSet.size;
    if (isDuplicate) throw new BadRequestException('primary, secondary, other 중에 positionId가 중복 되어 있습니다.');

    await this.positionService.findByIds(checkPostionIds);

    const result = await this.userCareerRepository.bulkInsert(userId, checkPostionIds, careerTypes);
    return result;
  }
}
