import { ICommand } from '@nestjs/cqrs';

export class DeletePartyApplicationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyApplicationId: number,
  ) {}
}
