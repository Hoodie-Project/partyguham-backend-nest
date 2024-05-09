import { ICommand } from '@nestjs/cqrs';

export class CreateGuildCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly title: string,
    readonly content: string,
  ) {}
}
