import { IQuery } from '@nestjs/cqrs';

export class GetPartyApplicationMeQuery implements IQuery {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
  ) {}
}
