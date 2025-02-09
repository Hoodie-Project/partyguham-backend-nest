import { ICommand } from '@nestjs/cqrs';

export class CreatePartyApplicationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
    readonly message: string,
  ) {}
}
