import { IQuery } from '@nestjs/cqrs';

export class GetPartiesQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
  ) {}
}
