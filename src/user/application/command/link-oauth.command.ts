import { ICommand } from '@nestjs/cqrs';

export class LinkOauthCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly signupToken: string,
  ) {}
}
