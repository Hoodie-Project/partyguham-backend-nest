import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly account: string,
    readonly nickname: string,
    readonly email: string,
  ) {}
}
