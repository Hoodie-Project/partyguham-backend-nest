import { IQuery } from '@nestjs/cqrs';

export class GetPartyApplicationsQuery implements IQuery {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly status: string,
  ) {}
}
