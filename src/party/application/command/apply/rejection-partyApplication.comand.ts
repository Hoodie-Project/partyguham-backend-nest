import { ICommand } from '@nestjs/cqrs';

export class RejectionPartyApplicationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyApplicationId: number,
  ) {}
}
