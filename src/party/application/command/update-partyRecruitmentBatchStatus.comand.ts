import { ICommand } from '@nestjs/cqrs';

export class UpdatePartyRecruitmentBatchStatusCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentIds: number[],
  ) {}
}
