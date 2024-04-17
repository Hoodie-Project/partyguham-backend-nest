import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { PlatformEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { GoogleLoginCommand } from './google-login.command';

@Injectable()
@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ code }: GoogleLoginCommand) {
    const google_api_url = await axios.post(
      `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.CLIENT_REDIRECT_URL}&grant_type=authorization_code`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    console.log('google_api_url', google_api_url);

    const googleData = await google_api_url.data;

    console.log('googleData', googleData);

    const googleAccessToken = googleData.access_token;
    const googleRefreshToken = googleData.refresh_token;

    const googleUserInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleAccessToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    console.log('googleUserInfo', googleUserInfo);

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
    const externalId: string = googleUserInfo.data.id;
    const email = googleUserInfo.data.kakao_account.email;
    const image = googleUserInfo.data.properties.profile_image;

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken, email, image };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(
        externalId,
        PlatformEnum.GOOGLE,
        googleAccessToken,
      );
      const encryptOauthId = await this.authService.encrypt(String(createOauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken, email, image };
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
