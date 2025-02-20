import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PositionService } from 'src/position/position.service';
import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';
import { CareerTypeEnum } from 'src/user/infra/db/entity/user_career.entity';
import { UpdateUserCareerCommand } from './update-userCareer.command';

@Injectable()
@CommandHandler(UpdateUserCareerCommand)
export class UpdateUserCareerHandler implements ICommandHandler<UpdateUserCareerCommand> {
  constructor(
    @Inject('UserCareerRepository') private userCareerRepository: IUserCareerRepository,
    private readonly positionService: PositionService,
  ) {}

  async execute(command: UpdateUserCareerCommand) {
    const { userId, career } = command;

    const find = await this.userCareerRepository.findByUserId(userId);

    find.map((value) => {
      if (value.userId !== userId) {
        throw new ForbiddenException('변경 권한이 없습니다.');
      }
    });

    // 저장되어있는 유저 커리어 조회

    await this.userCareerRepository.updateCareers(career);

    const result = await this.userCareerRepository.findByUserId(userId);

    return result;
  }
}
