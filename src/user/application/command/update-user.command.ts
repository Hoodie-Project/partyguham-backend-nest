import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly gender: string,
    readonly genderVisible: boolean,
    readonly birth: string,
    readonly birthVisible: boolean,
    readonly portfolio: string,
    readonly image: string,
  ) {}
}
