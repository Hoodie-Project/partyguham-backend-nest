import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KakaoAppLoginCommand } from './kakao-app-login.command';
import axios from 'axios';

import { ProviderEnum } from 'src/auth/entity/oauth.entity';

import { OauthService } from 'src/auth/oauth.service';
import { UserService } from '../user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
@CommandHandler(KakaoAppLoginCommand)
export class KakaoAppLoginHandler implements ICommandHandler<KakaoAppLoginCommand> {
  constructor(
    private userService: UserService,
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ kakaoAccessToken }: KakaoAppLoginCommand) {
    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    //! kakaoUserInfo
    // data: {
    //   id: 1234,
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

    const externalId: string = kakaoUserInfo.data.id;
    const email = kakaoUserInfo.data.kakao_account.email;

    let image = null;
    if (kakaoUserInfo.data.kakao_account.profile_image_needs_agreement) {
      image = kakaoUserInfo.data.properties.profile_image;
    }

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId, email, image);

      return { type: 'signup', signupAccessToken, email, image };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(
        externalId,
        ProviderEnum.KAKAO,
        kakaoAccessToken,
        email,
        image,
      );
      const encryptOauthId = await this.authService.encrypt(String(createOauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId, email, image);

      return { type: 'signup', signupAccessToken, email, image };
    }

    if (oauth.userId) {
      await this.userService.validateLogin(oauth.userId, oauth.id);

      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const accessToken = await this.authService.createAccessToken(encryptOauthId);
      const refreshToken = await this.authService.createRefreshToken(encryptOauthId);

      this.authService.saveRefreshToken(oauth.userId, refreshToken);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
