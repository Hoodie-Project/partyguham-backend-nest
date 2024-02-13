import { ICommand } from '@nestjs/cqrs';

export class CreatePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly title: string,
    readonly content: string,
    readonly positionId: number,
  ) {}
}
