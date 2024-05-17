import { ICommand } from '@nestjs/cqrs';

export class DeleteUserLocationCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userLocationId: number,
  ) {}
}
