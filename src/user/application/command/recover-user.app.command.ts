import { ICommand } from '@nestjs/cqrs';

export class RecoverUserAppCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly userExternalId: string,
  ) {}
}
