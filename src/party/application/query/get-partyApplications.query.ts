import { IQuery } from '@nestjs/cqrs';

export class GetPartyApplicationsQuery implements IQuery {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
  ) {}
}
