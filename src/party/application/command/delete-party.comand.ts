import { ICommand } from '@nestjs/cqrs';

export class DeletePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
