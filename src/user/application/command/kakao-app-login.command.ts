import { ICommand } from '@nestjs/cqrs';

export class KakaoAppLoginCommand implements ICommand {
  constructor(readonly uid: string) {}
}
