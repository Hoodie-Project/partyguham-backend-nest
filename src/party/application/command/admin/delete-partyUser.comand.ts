import { ICommand } from '@nestjs/cqrs';

export class DeletePartyUserCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyUserId: number,
  ) {}
}
