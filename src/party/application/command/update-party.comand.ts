import { ICommand } from '@nestjs/cqrs';

export class UpdatePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly title: string,
    readonly content: string,
  ) {}
}
