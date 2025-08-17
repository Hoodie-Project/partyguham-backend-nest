import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';
import { DeleteUserCareersCommand } from './delete-userCareers.command';

@Injectable()
@CommandHandler(DeleteUserCareersCommand)
export class DeleteUserCareersHandler implements ICommandHandler<DeleteUserCareersCommand> {
  constructor(@Inject('UserCareerRepository') private userCareerRepository: IUserCareerRepository) {}

  async execute(command: DeleteUserCareersCommand) {
    const { userId } = command;

    const savedUserLocations = await this.userCareerRepository.findByUserId(userId);

    if (!savedUserLocations) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    const result = await this.userCareerRepository.deleteByUserId(userId);

    // if (!result) {
    //   throw new InternalServerErrorException('삭제 실패');
    // }
    // -> 개선필요

    return result;
  }
}
