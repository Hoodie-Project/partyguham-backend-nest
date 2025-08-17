import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { ProviderEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { KakaoLinkLoginCommand } from './kakaoLink-login.command';

@Injectable()
@CommandHandler(KakaoLinkLoginCommand)
export class KakaoLinkLoginHandler implements ICommandHandler<KakaoLinkLoginCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ code }: KakaoLinkLoginCommand) {
    const kakao_api_url = await axios.get(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_url=${process.env.KAKAO_LINK_REDIRECT_URI}&code=${code}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    const kakaoData = await kakao_api_url.data;

    const kakaoAccessToken = kakaoData.access_token;
    const kakaoRefreshToken = kakaoData.refresh_token;

    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
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
    const externalId: string = kakaoUserInfo.data.id;
    const email = kakaoUserInfo.data.kakao_account.email;
    let image = null;
    if (kakaoUserInfo.data.kakao_account.profile_image_needs_agreement) {
      image = kakaoUserInfo.data.properties.profile_image;
    }

    const oauth = await this.oauthService.findByExternalId(externalId);

    // oauth가 있으나 user가 없음
    if (oauth && !oauth.userId) {
      const linkToken = await this.authService.createSignupToken(oauth.id, email, image);

      return { type: 'link', linkToken, email };
    }

    // oauth가 없음 (해당 계정으로 연결이 된적 없음)
    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(
        externalId,
        ProviderEnum.KAKAO,
        kakaoAccessToken,
        email,
        image,
      );

      const linkToken = await this.authService.createSignupToken(createOauth.id, email, image);

      return { type: 'link', linkToken, email };
    }

    // 이미 계정이 있음
    if (oauth.userId) {
      return { type: 'existed' };
    }
  }
}
