import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';

import { UserLocationDeleteCommand } from './userLocation.delete.command';

@Injectable()
@CommandHandler(UserLocationDeleteCommand)
export class UserLocationDeleteHandler implements ICommandHandler<UserLocationDeleteCommand> {
  constructor(@Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository) {}

  async execute(command: UserLocationDeleteCommand) {
    const { userId, userLocationId } = command;

    const savedUserLocation = await this.userLocationRepository.findById(userLocationId);

    if (!savedUserLocation) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    if (savedUserLocation.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    const result = await this.userLocationRepository.deleteById(userLocationId);

    if (!result) {
      throw new InternalServerErrorException('삭제 실패');
    }

    return result;
  }
}
