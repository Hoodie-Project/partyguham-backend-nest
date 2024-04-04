import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { LocationService } from 'src/location/location.service';
import { UpdateUserLocationCommand } from './update-userLocation.command';

@Injectable()
@CommandHandler(UpdateUserLocationCommand)
export class UpdateUserLocationHandler implements ICommandHandler<UpdateUserLocationCommand> {
  constructor(
    @Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository,
    private readonly locationService: LocationService,
  ) {}

  async execute(command: UpdateUserLocationCommand) {
    const { userId, updateUserLocation } = command;

    // 중복 저장 방지 로직
    if (updateUserLocation) {
      if (updateUserLocation.length === 3) {
        throw new ConflictException('관심지역을 3개 초과하여 수정 할 수 없습니다.');
      }
    }

    // locationId 확인
    const updateLocationIds = updateUserLocation.map((value) => value.locationId);
    await this.locationService.findByIds(updateLocationIds);

    // 저장된 Location을 UserId로 불러오기
    const savedUserLocation = await this.userLocationRepository.findByUserId(userId);

    // DB에 저장된 데이터 제외
    const savedLocaiontId = savedUserLocation.map((value) => value.locationId);

    const duplicated = updateLocationIds.filter((id) => savedLocaiontId.includes(id));
    if (duplicated.length > 0) {
      throw new ConflictException(
        `수정 하려는 데이터는 이미 저장되어있는 데이터 입니다. { locationId : [${duplicated}] }`,
      );
    }

    // DB에 저장된 id(PK) 존재 확인
    const savedId = savedUserLocation.map((value) => value.id);

    const userLocationId = updateUserLocation.map((value) => value.id);
    const uniqueIds = userLocationId.filter((id) => !savedId.includes(id));
    if (uniqueIds.length > 0) {
      throw new ConflictException(`수정 하려는 id가 올바르지 않습니다. { id : [${uniqueIds}] }`);
    }

    const update = updateUserLocation.map((value) => {
      return { ...value, userId: userId };
    });

    // 저장
    const result = await this.userLocationRepository.bulkUpdate(update);

    return result;
  }
}
