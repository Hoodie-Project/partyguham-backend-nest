import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserLocationCreateCommand } from './userLocation.create.command';
import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { LocationService } from 'src/location/location.service';

@Injectable()
@CommandHandler(UserLocationCreateCommand)
export class UserLocationCreateHandler implements ICommandHandler<UserLocationCreateCommand> {
  constructor(
    @Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository,
    private readonly locationService: LocationService,
  ) {}

  async execute(command: UserLocationCreateCommand) {
    const { userId, locations } = command;

    const locationIds = locations.map((value) => value.id);
    // locationIds 확인
    await this.locationService.findByIds(locationIds);

    const savedUserLocation = await this.userLocationRepository.findByUserId(userId);
    const savedLocaiontId = savedUserLocation.map((value) => value.locationId);

    // // DB에 저장된 데이터 제외
    const duplicated = locationIds.filter((item) => savedLocaiontId.includes(item));
    if (duplicated.length > 0) {
      throw new ConflictException(`이미 저장된 데이터가 있습니다.`);
    }

    // 저장
    const result = await this.userLocationRepository.bulkInsert(userId, locationIds);

    return result;
  }
}
