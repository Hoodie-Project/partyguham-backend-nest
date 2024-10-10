import { IQuery } from '@nestjs/cqrs';

export class GetPartyQuery implements IQuery {
  constructor(
    readonly partyId: number,
    readonly userId: number | null,
  ) {}
}
