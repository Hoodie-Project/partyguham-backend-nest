import { IQuery } from '@nestjs/cqrs';

export class GetPartyUserQuery implements IQuery {
  constructor(readonly partyId: number) {}
}
