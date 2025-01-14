import { ICommand } from '@nestjs/cqrs';

export class GoogleAppLinkCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly googleAccessToken: string,
  ) {}
}
