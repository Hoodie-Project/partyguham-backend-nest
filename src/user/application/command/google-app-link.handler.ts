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

  async execute({ userId, idToken }: GoogleAppLinkCommand) {
    const googleIdTokenCheck = await axios.post(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const googleUserInfo = googleIdTokenCheck.data;

    // google
    // {
    //   "iss": "https://accounts.google.com",
    //   "azp": "클라이언트 아이디",
    //   "aud": "클라이언트 아이디",
    //   "sub": "고유 아이디",
    //   "email": "tmfrl1590@gmail.com",
    //   "email_verified": "true",
    //   "name": "김슬기",
    //   "picture": "https://lh3.googleusercontent.com/a/ACg8ocIi95E21XKSRvqOLtIWnzF1u4bzhorVD4sTClvT4LjPsK_3Nw=s96-c",
    //   "given_name": "슬기",
    //   "family_name": "김",
    //   "iat": "1738326489",
    //   "exp": "1738330089",
    //   "alg": "RS256",
    //   "kid": "fa072f75784642615087c7182c101341e18f7a3a",
    //   "typ": "JWT"
    // }

    const externalId: string = googleUserInfo.sub;
    const email = googleUserInfo.email;
    const image = googleUserInfo.picture ? googleUserInfo.picture : null;

    const oauth = await this.oauthService.findByExternalId(externalId);

    // oauth가 있으나 user가 없음
    if (oauth && !oauth.userId) {
      await this.oauthService.updateUserIdById(oauth.id, userId);

      return { type: 'link', email };
    }

    // oauth가 없음 (해당 계정으로 연결이 된적 없음)
    if (!oauth) {
      await this.oauthService.createWithoutUserId(externalId, ProviderEnum.GOOGLE, idToken, email, image);

      return { type: 'link', email };
    }

    // 이미 계정이 있음
    if (oauth.userId) {
      return { type: 'existed' };
    }
  }
}
