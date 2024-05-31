import { ICommand } from '@nestjs/cqrs';

export class DeleteUserPersonalityByQuestionCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly personalityQuestionId: number,
  ) {}
}
