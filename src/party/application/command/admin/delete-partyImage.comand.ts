import { ICommand } from '@nestjs/cqrs';

export class DeletePartyImageCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
