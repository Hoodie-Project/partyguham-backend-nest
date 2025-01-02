import { ICommand } from '@nestjs/cqrs';

export class KakaoAppLinkCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly kakaoAccessToken: string,
  ) {}
}
