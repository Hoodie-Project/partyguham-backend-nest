import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KakaoCodeCommand } from './kakao-code.command';

@Injectable()
@CommandHandler(KakaoCodeCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoCodeCommand> {
  constructor() {}

  async execute({}: KakaoCodeCommand) {
    const kakaoRestApiKey = process.env.KAKAO_RESTAPI_KEY;
    const kakaoRedirectUri = process.env.KAKAO_REDIRECT_URI;
    return `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestApiKey}&redirect_uri=${kakaoRedirectUri}&response_type=code`;
  }
}
