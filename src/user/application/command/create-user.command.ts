import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly nickname: string,
    readonly email: string,
    readonly gender: string,
    readonly birth: Date,
  ) {}
}
