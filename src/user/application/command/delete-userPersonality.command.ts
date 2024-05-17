import { ICommand } from '@nestjs/cqrs';

export class DeleteUserPersonalityCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userPersonalityId: number,
  ) {}
}
