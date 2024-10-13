import { IQuery } from '@nestjs/cqrs';

export class GetRecruitmentsPersonalizedQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly userId: number,
  ) {}
}
