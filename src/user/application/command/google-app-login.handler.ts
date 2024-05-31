import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { PlatformEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { GoogleAppLoginCommand } from './google-app-login.command';

@Injectable()
@CommandHandler(GoogleAppLoginCommand)
export class GoogleAppLoginHandler implements ICommandHandler<GoogleAppLoginCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ uid }: GoogleAppLoginCommand) {
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

    const decryptUid = this.authService.decrypt(String(uid));
    const oauth = await this.oauthService.findByExternalId(decryptUid);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId);

      return { type: 'signup', signupAccessToken };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(decryptUid, PlatformEnum.GOOGLE, null);
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
