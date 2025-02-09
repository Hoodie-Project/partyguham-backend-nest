import { IQuery } from '@nestjs/cqrs';

export class GetGuildQuery implements IQuery {
  constructor(readonly guildId: number) {}
}
