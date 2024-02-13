import { ICommand } from '@nestjs/cqrs';

export class UpdateCommentCommand implements ICommand {
  constructor(
    readonly commentId: number,
    readonly userId: number,
    readonly comment: string,
  ) {}
}
