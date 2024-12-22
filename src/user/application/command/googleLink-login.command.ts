import { ICommand } from '@nestjs/cqrs';

export class GoogleLinkLoginCommand implements ICommand {
  constructor(readonly code: string) {}
}
