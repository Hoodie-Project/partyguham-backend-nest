import { ICommand } from '@nestjs/cqrs';

export class DeleteCommentCommand implements ICommand {
  constructor(
    readonly commentId: number,
    readonly userId: number,
  ) {}
}
