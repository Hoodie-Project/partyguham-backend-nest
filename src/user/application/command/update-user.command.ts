import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly gender: string,
    readonly birth: string,
  ) {}
}
