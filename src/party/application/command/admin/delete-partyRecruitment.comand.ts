import { ICommand } from '@nestjs/cqrs';

export class DeletePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
  ) {}
}
