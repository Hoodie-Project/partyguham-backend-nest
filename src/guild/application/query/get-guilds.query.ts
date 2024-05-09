import { IQuery } from '@nestjs/cqrs';

export class GetGuildsQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
  ) {}
}
