import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';
import { KakaoDataCommand } from './kakao-data.command';
import { PlatformEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';

@Injectable()
@CommandHandler(KakaoDataCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoDataCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ code }: KakaoDataCommand) {
    const kakao_api_url = await axios.get(
      `https://kauth.kakao.com/oauth/token
    ?grant_type=authorization_code
    &client_id=${process.env.KAKAO_RESTAPI}
    &redirect_url=${process.env.KAKAO_REDIRECT_URI}
    &code=${code}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    const accessToken = await kakao_api_url.data.access_token;

    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const externalId: string = kakaoUserInfo.data.id;

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(externalId, PlatformEnum.KAKAO, accessToken);
      const encryptOauthId = await this.authService.encrypt(String(createOauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken, email: 'example@hoodiev.com' };
    } else {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));

      const accessToken = await this.authService.createAccessToken(encryptOauthId);
      const refreshToken = await this.authService.createRefreshToken(encryptOauthId);

      this.authService.saveRefreshToken(oauth.userId, refreshToken);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
