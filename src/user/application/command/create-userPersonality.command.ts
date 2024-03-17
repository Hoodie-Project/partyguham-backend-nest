import { ICommand } from '@nestjs/cqrs';
import { UserPersonalityDto } from 'src/user/interface/dto/request/create-userPersonality.request.dto';

export class CreateUserPersonalityCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userPersonality: UserPersonalityDto[],
  ) {}
}
