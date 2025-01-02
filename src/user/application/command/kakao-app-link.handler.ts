import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { ProviderEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { KakaoAppLinkCommand } from './kakao-app-link.command';

@Injectable()
@CommandHandler(KakaoAppLinkCommand)
export class KakaoAppLinkHandler implements ICommandHandler<KakaoAppLinkCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ userId, kakaoAccessToken }: KakaoAppLinkCommand) {
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
      await this.oauthService.updateUserIdById(oauth.id, userId);

      return { type: 'link', email };
    }

    // oauth가 없음 (해당 계정으로 연결이 된적 없음)
    if (!oauth) {
      await this.oauthService.createWithoutUserId(externalId, ProviderEnum.KAKAO, kakaoAccessToken, email, image);

      return { type: 'link', email };
    }

    // 이미 계정이 있음
    if (oauth.userId) {
      return { type: 'existed' };
    }
  }
}
