import { IQuery } from '@nestjs/cqrs';

export class GetPartyRecruitmentQuery implements IQuery {
  constructor(
    readonly userId: number,
    readonly partyRecruitmentId: number,
  ) {}
}
