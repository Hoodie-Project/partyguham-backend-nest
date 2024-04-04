import { ICommand } from '@nestjs/cqrs';
import { UpdateUserLocationItemRequestDto } from 'src/user/interface/dto/request/update-userLocation.request.dto';

export class UpdateUserLocationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly updateUserLocation: UpdateUserLocationItemRequestDto[],
  ) {}
}
