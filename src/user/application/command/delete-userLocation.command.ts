import { ICommand } from '@nestjs/cqrs';
import { UpdateUserLocationItemRequestDto } from 'src/user/interface/dto/request/update-userLocation.request.dto';

export class DeleteUserLocationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly deleteUserLocationIds: number[],
  ) {}
}
