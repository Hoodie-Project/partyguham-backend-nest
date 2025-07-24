import { ICommand } from '@nestjs/cqrs';
import { StatusEnum } from 'src/common/entity/baseEntity';

export class UpdatePartyStatusCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly status: StatusEnum,
  ) {}
}
