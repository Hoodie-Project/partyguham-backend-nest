import { ICommand } from '@nestjs/cqrs';

export class DeletePartyUsersCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyUserIds: number[],
  ) {}
}
