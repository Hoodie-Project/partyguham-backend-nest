import { IQuery } from '@nestjs/cqrs';

export class GetFollowQuery implements IQuery {
  constructor(
    readonly userId: number,
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
  ) {}
}
