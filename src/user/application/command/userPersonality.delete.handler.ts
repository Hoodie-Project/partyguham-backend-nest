import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserPersonalityDeleteCommand } from './userPersonality.delete.command';
import { IUserPersonalityRepository } from 'src/user/domain/user/repository/iuserPersonality.repository';

@Injectable()
@CommandHandler(UserPersonalityDeleteCommand)
export class UserPersonalityDeleteHandler implements ICommandHandler<UserPersonalityDeleteCommand> {
  constructor(@Inject('UserPersonalityRepository') private userPersonalityRepository: IUserPersonalityRepository) {}

  async execute(command: UserPersonalityDeleteCommand) {
    const { userId, userPersonalityId } = command;

    const savedUserPersonality = await this.userPersonalityRepository.findById(userPersonalityId);

    if (!savedUserPersonality) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    if (savedUserPersonality.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    const result = await this.userPersonalityRepository.deleteById(userPersonalityId);

    if (!result) {
      throw new InternalServerErrorException('삭제 실패');
    }

    return result;
  }
}
