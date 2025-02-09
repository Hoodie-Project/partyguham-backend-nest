import { ICommand } from '@nestjs/cqrs';

export class DeleteGuildCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly guildId: number,
  ) {}
}
