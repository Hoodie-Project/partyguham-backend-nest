import { IQuery } from '@nestjs/cqrs';

export class GetPartyLikeQuery implements IQuery {
  constructor(
    readonly userId: number,
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
  ) {}
}
