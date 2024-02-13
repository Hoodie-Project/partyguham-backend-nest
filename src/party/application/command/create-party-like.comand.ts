import { ICommand } from '@nestjs/cqrs';

export class CreatePartyLikeCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
