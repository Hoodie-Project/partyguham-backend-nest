import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { ProviderEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { GoogleAppLinkCommand } from './google-app-link.command';

@Injectable()
@CommandHandler(GoogleAppLinkCommand)
export class GoogleAppLinkHandler implements ICommandHandler<GoogleAppLinkCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ userId, googleAccessToken }: GoogleAppLinkCommand) {
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
    const image = googleUserInfo.data.picture ? googleUserInfo.data.picture : null;

    const oauth = await this.oauthService.findByExternalId(externalId);

    // oauth가 있으나 user가 없음
    if (oauth && !oauth.userId) {
      await this.oauthService.updateUserIdById(oauth.id, userId);

      return { type: 'link', email };
    }

    // oauth가 없음 (해당 계정으로 연결이 된적 없음)
    if (!oauth) {
      await this.oauthService.createWithoutUserId(externalId, ProviderEnum.GOOGLE, googleAccessToken, email, image);

      return { type: 'link', email };
    }

    // 이미 계정이 있음
    if (oauth.userId) {
      return { type: 'existed' };
    }
  }
}
