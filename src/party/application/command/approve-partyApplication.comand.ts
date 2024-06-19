import { ICommand } from '@nestjs/cqrs';

export class ApprovePartyApplicationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyApplicationId: number,
  ) {}
}
