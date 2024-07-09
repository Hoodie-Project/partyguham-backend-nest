import { ICommand } from '@nestjs/cqrs';

export class ArchivePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
  ) {}
}
