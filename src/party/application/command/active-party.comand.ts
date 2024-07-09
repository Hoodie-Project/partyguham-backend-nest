import { ICommand } from '@nestjs/cqrs';

export class ActivePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
