import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';
import { KakaoLoginCommand } from './kakao-login.command';
import { ProviderEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { UserService } from '../user.service';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { USER_ERROR } from 'src/common/error/user-error.message';

@Injectable()
@CommandHandler(KakaoLoginCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoLoginCommand> {
  constructor(
    private oauthService: OauthService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async execute({ code }: KakaoLoginCommand) {
    const kakao_api_url = await axios.get(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_url=${process.env.KAKAO_REDIRECT_URI}&code=${code}&client_secret=${process.env.KAKAO_CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    const kakaoData = await kakao_api_url.data;

    const kakaoAccessToken = kakaoData.access_token;
    // const kakaoRefreshToken = kakaoData.refresh_token;

    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    //kakaoUserInfo =
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
    let image = kakaoUserInfo?.data?.properties?.profile_image || null;

    if (!kakaoUserInfo?.data?.kakao_account?.profile_image_needs_agreement) {
      image = null;
    }

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const signupAccessToken = await this.authService.createSignupToken(oauth.id, email, image);

      return { type: 'signup', signupAccessToken, email };
    }

    if (!oauth) {
      const createOauth = await this.oauthService.createWithoutUserId(
        externalId,
        ProviderEnum.KAKAO,
        kakaoAccessToken,
        email,
        image,
      );

      const signupAccessToken = await this.authService.createSignupToken(createOauth.id, email, image);

      return { type: 'signup', signupAccessToken, email };
    }

    if (oauth.userId) {
      const user = await this.userService.findById(oauth.userId);

      if (user.status === StatusEnum.DELETED) {
        return { type: USER_ERROR.USER_DELETED.error };
      }

      if (user.status === StatusEnum.INACTIVE) {
        const recoverToken = await this.authService.createRecoverToken(oauth.id);

        return {
          type: USER_ERROR.USER_DELETED_30D.error,
          recoverToken,
          email: user.email,
          deletedAt: user.updatedAt,
        };
      }

      if (user.status !== StatusEnum.ACTIVE) {
        return { type: USER_ERROR.USER_FORBIDDEN_DISABLED.error };
      }

      const accessToken = await this.authService.createAccessToken(oauth.id);
      const refreshToken = await this.authService.createRefreshToken(oauth.userId);

      // this.authService.saveRefreshToken(oauth.userId, refreshToken);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
