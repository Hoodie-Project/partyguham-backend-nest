import { ICommand } from '@nestjs/cqrs';

export class CreatePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly positionId: number,
    readonly content: string,
    readonly recruiting_count: number,
  ) {}
}
