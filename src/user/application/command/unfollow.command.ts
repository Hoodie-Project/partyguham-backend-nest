import { ICommand } from '@nestjs/cqrs';

export class UnfollowCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly nickname: string,
  ) {}
}
