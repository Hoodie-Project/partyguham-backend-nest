import { ICommand } from '@nestjs/cqrs';

export class RejectionAdminPartyApplicationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyApplicationId: number,
  ) {}
}
