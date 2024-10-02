import { IQuery } from '@nestjs/cqrs';

export class GetRecruitmentsQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly main: string | null,
    readonly positionIds: number[],
    readonly titleSearch: string,
  ) {}
}
