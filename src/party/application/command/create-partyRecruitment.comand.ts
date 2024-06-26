import { ICommand } from '@nestjs/cqrs';
import { RecruitmentRequestDto } from 'src/party/interface/dto/request/recruitment.request.dto';

export class CreatePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly recruitments: RecruitmentRequestDto[],
  ) {}
}
