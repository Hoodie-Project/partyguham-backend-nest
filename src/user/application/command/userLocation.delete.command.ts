import { ICommand } from '@nestjs/cqrs';

export class UserLocationDeleteCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userLocationId: number,
  ) {}
}
