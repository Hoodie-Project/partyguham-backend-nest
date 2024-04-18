import { ICommand } from '@nestjs/cqrs';

export class GoogleLoginCommand implements ICommand {
  constructor(readonly code: string) {}
}
