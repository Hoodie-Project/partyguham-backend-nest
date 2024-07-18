import { ICommand } from '@nestjs/cqrs';

export class EndPartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
