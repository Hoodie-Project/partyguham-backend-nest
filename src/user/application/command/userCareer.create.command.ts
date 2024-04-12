import { ICommand } from '@nestjs/cqrs';
import { CareerDto } from 'src/user/interface/dto/request/create-userCareer.request.dto';

export class UserCareerCreateCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly career: CareerDto[],
  ) {}
}
