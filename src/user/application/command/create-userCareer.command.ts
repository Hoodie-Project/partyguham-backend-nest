import { ICommand } from '@nestjs/cqrs';
import { UserCareerDto } from 'src/user/interface/dto/request/create-userCareer.request.dto';

export class CreateUserCareerCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly primary: UserCareerDto,
    readonly secondary: UserCareerDto,
    readonly other: UserCareerDto[],
  ) {}
}
