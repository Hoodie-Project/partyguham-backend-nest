import { ICommand } from '@nestjs/cqrs';

export class CreateUserLocationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly locationIds: number[],
  ) {}
}
