import { IQuery } from '@nestjs/cqrs';

export class GetPartyRecruitmentQuery implements IQuery {
  constructor(
    readonly partyId: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly main: string | null,
  ) {}
}
