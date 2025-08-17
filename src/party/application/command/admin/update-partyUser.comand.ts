import { ICommand } from '@nestjs/cqrs';

export class UpdatePartyUserCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyUserId: number,
    readonly positionId: number,
  ) {}
}
