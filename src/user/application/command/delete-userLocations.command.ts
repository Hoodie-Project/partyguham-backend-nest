import { ICommand } from '@nestjs/cqrs';

export class DeleteUserLocationsCommand implements ICommand {
  constructor(readonly userId: number) {}
}
