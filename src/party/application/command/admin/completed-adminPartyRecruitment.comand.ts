import { ICommand } from '@nestjs/cqrs';

export class CompletedAdminPartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
  ) {}
}
