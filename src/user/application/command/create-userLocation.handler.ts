import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserLocationCommand } from './create-userLocation.command';
import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { LocationService } from 'src/location/location.service';

@Injectable()
@CommandHandler(CreateUserLocationCommand)
export class CreateUserLocationHandler implements ICommandHandler<CreateUserLocationCommand> {
  constructor(
    @Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository,
    private readonly locationService: LocationService,
  ) {}

  async execute(command: CreateUserLocationCommand) {
    const { userId, locationIds } = command;

    // 중복 저장 방지 로직
    await this.locationService.findByIds(locationIds);

    const result = await this.userLocationRepository.bulkInsert(userId, locationIds);

    return result;
  }
}
