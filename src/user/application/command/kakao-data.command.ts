import { ICommand } from '@nestjs/cqrs';

export class KakaoDataCommand implements ICommand {
  constructor(readonly code: string) {}
}
