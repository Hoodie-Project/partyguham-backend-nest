import { ICommand } from '@nestjs/cqrs';

export class LeavePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
