import { ICommand } from '@nestjs/cqrs';
import { RecruitmentDto } from 'src/party/interface/dto/recruitmentDto';

export class CreatePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly recruitment: RecruitmentDto[],
  ) {}
}
