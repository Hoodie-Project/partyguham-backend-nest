import { ICommand } from '@nestjs/cqrs';

export class UserPersonalityDeleteCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userPersonalityId: number,
  ) {}
}
