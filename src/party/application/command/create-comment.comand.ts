import { ICommand } from '@nestjs/cqrs';

export class CreateCommentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly comment: string,
  ) {}
}
