import { BadRequestException, ForbiddenException, HttpException, Inject, Injectable } from '@nestjs/common';
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

    // locationId 확인
    await this.locationService.findByIds(locationIds);

    const userLocation = await this.userLocationRepository.findByUserId(userId);

    // 중복 저장 방지 로직
    if (userLocation) {
      if (userLocation.length === 3) {
        throw new ForbiddenException('관심지역을 3개 초과하여 저장 할 수 없습니다.');
      }

      const set = new Set(locationIds);
      const duplicate = userLocation.filter((value) => set.has(value.locationId)).map((value) => value.locationId);

      if (duplicate.length > 0) {
        throw new ForbiddenException(`${duplicate}는 중복된 locationId 입니다.`);
      }
    }

    // 저장
    const result = await this.userLocationRepository.bulkInsert(userId, locationIds);

    return result;
  }
}
