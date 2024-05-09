import { ICommand } from '@nestjs/cqrs';

export class GuildUpdateCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly guildId: number,
    readonly title: string,
    readonly content: string,
  ) {}
}
