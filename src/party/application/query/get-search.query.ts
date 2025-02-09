import { IQuery } from '@nestjs/cqrs';

export class GetSearchQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly titleSearch: string | undefined,
  ) {}
}
