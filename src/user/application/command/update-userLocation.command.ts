import { ICommand } from '@nestjs/cqrs';
import { UserLocation } from 'src/user/interface/dto/userLocation';

export class UpdateUserLocationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userLocations: UserLocation[],
  ) {}
}
