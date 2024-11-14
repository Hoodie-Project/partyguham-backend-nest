import { IQuery } from '@nestjs/cqrs';

export class GetRecruitmentsQuery implements IQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly main?: string[] | string,
    readonly positionIds?: number[] | undefined,
    readonly partyTypeId?: number | undefined,
    readonly titleSearch?: string | undefined,
  ) {}
}
