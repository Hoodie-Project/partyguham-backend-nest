import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KakaoLinkCodeCommand } from './kakaoLink-code.command';

@Injectable()
@CommandHandler(KakaoLinkCodeCommand)
export class KakaoLinkCodeHandler implements ICommandHandler<KakaoLinkCodeCommand> {
  constructor() {}

  async execute({}: KakaoLinkCodeCommand) {
    const kakaoRestApiKey = process.env.KAKAO_RESTAPI_KEY;
    const kakaoLinkRedirectUri = process.env.KAKAO_LINK_REDIRECT_URI;
    return `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestApiKey}&redirect_uri=${kakaoLinkRedirectUri}&response_type=code`;
  }
}
