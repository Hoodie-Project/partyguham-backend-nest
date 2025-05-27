import { ICommand } from '@nestjs/cqrs';

export class ApproveAdminPartyApplicationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyApplicationId: number,
  ) {}
}
