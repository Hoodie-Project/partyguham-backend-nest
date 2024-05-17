import { ICommand } from '@nestjs/cqrs';

export class DeleteUserCareerCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userCareerId: number,
  ) {}
}
