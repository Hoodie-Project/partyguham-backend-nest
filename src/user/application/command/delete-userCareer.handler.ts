import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteUserCareerCommand } from './delete-userCareer.command';
import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';

@Injectable()
@CommandHandler(DeleteUserCareerCommand)
export class DeleteUserCareerHandler implements ICommandHandler<DeleteUserCareerCommand> {
  constructor(@Inject('UserCareerRepository') private userCareerRepository: IUserCareerRepository) {}

  async execute(command: DeleteUserCareerCommand) {
    const { userId, userCareerId } = command;

    const savedUserLocation = await this.userCareerRepository.findById(userCareerId);

    if (!savedUserLocation) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    if (savedUserLocation.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    const result = await this.userCareerRepository.deleteById(userCareerId);

    if (!result) {
      throw new InternalServerErrorException('삭제 실패');
    }

    return result;
  }
}
