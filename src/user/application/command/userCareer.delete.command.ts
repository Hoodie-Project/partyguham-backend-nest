import { ICommand } from '@nestjs/cqrs';

export class UserCareerDeleteCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userCareerId: number,
  ) {}
}
