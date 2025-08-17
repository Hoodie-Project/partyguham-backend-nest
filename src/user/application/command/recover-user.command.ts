import { ICommand } from '@nestjs/cqrs';

export class RecoverUserCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly oauthId: number,
  ) {}
}
