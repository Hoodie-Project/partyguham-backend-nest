import { ICommand } from '@nestjs/cqrs';

export class RecoverUserWebCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userExternalId: string,
  ) {}
}
