import { ICommand } from '@nestjs/cqrs';
import { UpdateCareerDto } from 'src/user/interface/dto/request/update-userCareer.request.dto';

export class UpdateUserCareerCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly career: UpdateCareerDto[],
  ) {}
}
