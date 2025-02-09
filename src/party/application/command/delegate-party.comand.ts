import { ICommand } from '@nestjs/cqrs';

export class DelegatePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyUserId: number,
  ) {}
}
