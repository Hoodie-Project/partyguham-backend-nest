import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';

import { ProviderEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { GoogleAppLoginCommand } from './google-app-login.command';
import { UserService } from '../user.service';

@Injectable()
@CommandHandler(GoogleAppLoginCommand)
export class GoogleAppLoginHandler implements ICommandHandler<GoogleAppLoginCommand> {
  constructor(
    private userService: UserService,
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ idToken }: GoogleAppLoginCommand) {
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
    //   "kid": "asdf",
    //   "typ": "JWT"
    // }

    const externalId: string = googleUserInfo.sub;
    const email = googleUserInfo.email;
    const image = googleUserInfo.picture ? googleUserInfo.picture : null;

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const signupAccessToken = await this.authService.createSignupToken(oauth.id, email, image);

      return { type: 'signup', signupAccessToken, email, image };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(
        externalId,
        ProviderEnum.GOOGLE,
        idToken,
        email,
        image,
      );

      const signupAccessToken = await this.authService.createSignupToken(createOauth.id, email, image);

      return { type: 'signup', signupAccessToken, email, image };
    }

    if (oauth.userId) {
      const result = await this.userService.validateLogin(oauth.userId);

      const accessToken = await this.authService.createAccessToken(result.userExternalId);
      const refreshToken = await this.authService.createRefreshToken(result.userExternalId);
      await this.authService.saveRefreshToken(result.userExternalId);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
