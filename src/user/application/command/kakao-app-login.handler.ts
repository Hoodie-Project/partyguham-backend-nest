import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { PlatformEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { KakaoAppLoginCommand } from './kakao-app-login.command';

@Injectable()
@CommandHandler(KakaoAppLoginCommand)
export class KakaoAppLoginHandler implements ICommandHandler<KakaoAppLoginCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ uid }: KakaoAppLoginCommand) {
    //! kakaoUserInfo
    // data: {
    //   id: 3405515435,
    //   connected_at: '2024-03-24T14:18:43Z',
    //   properties: {
    //     profile_image: 'http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640',
    //     thumbnail_image: 'http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R110x110'
    //   },
    //   kakao_account: {
    //     profile_image_needs_agreement: false,
    //     profile: [Object],
    //     has_email: true,
    //     email_needs_agreement: false,
    //     is_email_valid: true,
    //     is_email_verified: true,
    //     email: 'hoodiev.team@gmail.com'
    //   }
    // }
    const decryptUid = this.authService.decrypt(String(uid));

    const oauth = await this.oauthService.findByExternalId(decryptUid);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(decryptUid, PlatformEnum.KAKAO, null);
      const encryptOauthId = await this.authService.encrypt(String(createOauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken };
    }

    if (oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));

      const accessToken = await this.authService.createAccessToken(encryptOauthId);
      const refreshToken = await this.authService.createRefreshToken(encryptOauthId);

      this.authService.saveRefreshToken(oauth.userId, refreshToken);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
