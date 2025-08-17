import { ICommand } from '@nestjs/cqrs';

export class BatchDeletePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentIds: number[],
  ) {}
}
