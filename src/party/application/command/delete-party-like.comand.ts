import { ICommand } from '@nestjs/cqrs';

export class DeletePartyLikeCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
