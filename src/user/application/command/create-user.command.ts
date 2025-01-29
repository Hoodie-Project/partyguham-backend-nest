import { ICommand } from '@nestjs/cqrs';

export class CreateUserCommand implements ICommand {
  constructor(
    readonly oauthId: number,
    readonly email: string,
    readonly image: string,
    readonly nickname: string,
    readonly gender: string,
    readonly birth: string,
  ) {}
}
