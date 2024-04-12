import { ICommand } from '@nestjs/cqrs';
import { CareerTypeEnum } from 'src/user/infra/db/entity/user-career.entity';

export class UserCareerCreateCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly positionId: number,
    readonly years: number,
    readonly careerType: CareerTypeEnum,
  ) {}
}
