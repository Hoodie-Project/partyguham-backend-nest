import { ICommand } from '@nestjs/cqrs';

export class DeleteUserCareersCommand implements ICommand {
  constructor(readonly userId: number) {}
}
