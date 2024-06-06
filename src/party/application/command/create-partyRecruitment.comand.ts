import { ICommand } from '@nestjs/cqrs';

export class CreatePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly message: string,
  ) {}
}
