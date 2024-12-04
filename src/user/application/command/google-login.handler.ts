import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { ProviderEnum } from 'src/auth/entity/oauth.entity';
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
      `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&grant_type=authorization_code`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const googleData: {
      access_token: string;
      exires_in: number;
      refresh_token: string;
      scope: string;
      token_type: string;
    } = await google_api_url.data;

    const googleAccessToken = googleData.access_token;
    const googleRefreshToken = googleData.refresh_token;

    const googleUserInfo = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    // google
    // data: {
    //   id: '108484888597910532761',
    //   email: 'hoodiev.team@gmail.com',
    //   verified_email: true,
    //   name: 'hoodiev',
    //   given_name: 'hoodiev',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocK8VSpiTLRV-NfpHBPGkR4acApVopYk9JRfygfhutNKb6i9h2I=s96-c',
    //   locale: 'ko'
    // }

    const externalId: string = googleUserInfo.data.id;
    const email = googleUserInfo.data.email;
    const image = googleUserInfo.data.picture;

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken, email, image };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(
        externalId,
        ProviderEnum.GOOGLE,
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
