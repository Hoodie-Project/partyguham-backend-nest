import { IQuery } from '@nestjs/cqrs';

export class GetPartyUserAuthorityQuery implements IQuery {
  constructor(
    readonly partyId: number,
    readonly userId: number,
  ) {}
}
