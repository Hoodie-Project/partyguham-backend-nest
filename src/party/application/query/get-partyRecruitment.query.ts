import { IQuery } from '@nestjs/cqrs';

export class GetPartyRecruitmentQuery implements IQuery {
  constructor(readonly partyRecruitmentId: number) {}
}
