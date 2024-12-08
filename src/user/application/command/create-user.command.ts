import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly oauthId: number,
    readonly nickname: string,
    readonly gender: string,
    readonly birth: string,
  ) {}
}
