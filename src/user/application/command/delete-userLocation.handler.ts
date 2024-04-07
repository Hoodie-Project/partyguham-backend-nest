import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { LocationService } from 'src/location/location.service';

import { DeleteUserLocationCommand } from './delete-userLocation.command';

@Injectable()
@CommandHandler(DeleteUserLocationCommand)
export class DeleteUserLocationHandler implements ICommandHandler<DeleteUserLocationCommand> {
  constructor(
    @Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository,
    private readonly locationService: LocationService,
  ) {}

  async execute(command: DeleteUserLocationCommand) {
    const { userId, deleteUserLocationIds } = command;

    // locationId 확인

    await this.locationService.findByIds(deleteUserLocationIds);

    // 저장된 Location을 UserId로 불러오기
    const savedUserLocation = await this.userLocationRepository.findByUserId(userId);

    // DB에 저장된 id(PK) 존재 확인
    const savedId = savedUserLocation.map((value) => value.id);

    deleteUserLocationIds.forEach((id) => {
      if (!savedId.includes(id)) {
        throw new ConflictException(`삭제 하려는 id가 올바르지 않습니다.`);
      }
    });

    // 저장
    const result = await this.userLocationRepository.bulkDelete(deleteUserLocationIds);

    return result;
  }
}
