import { ICommand } from '@nestjs/cqrs';
import { LocationDto } from 'src/user/interface/dto/location.dto';

export class CreateUserLocationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly locations: LocationDto[],
  ) {}
}
