import { ICommand } from '@nestjs/cqrs';

export class KakaoLinkLoginCommand implements ICommand {
  constructor(readonly code: string) {}
}
