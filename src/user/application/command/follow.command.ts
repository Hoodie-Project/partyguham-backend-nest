import { ICommand } from '@nestjs/cqrs';

export class FollowCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly nickname: string,
  ) {}
}
