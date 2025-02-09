import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { DeleteUserLocationsCommand } from './delete-userLocations.command';

@Injectable()
@CommandHandler(DeleteUserLocationsCommand)
export class DeleteUserLocationsHandler implements ICommandHandler<DeleteUserLocationsCommand> {
  constructor(@Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository) {}

  async execute(command: DeleteUserLocationsCommand) {
    const { userId } = command;

    const savedUserLocation = await this.userLocationRepository.findByUserId(userId);

    if (!savedUserLocation) {
      throw new NotFoundException('저장된 데이터가 없습니다.');
    }

    const result = await this.userLocationRepository.deleteByUserId(userId);

    if (!result) {
      throw new InternalServerErrorException('삭제 실패');
    }

    return result;
  }
}
