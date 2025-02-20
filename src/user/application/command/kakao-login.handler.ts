import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';
import { KakaoLoginCommand } from './kakao-login.command';
import { ProviderEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { UserService } from '../user.service';

@Injectable()
@CommandHandler(KakaoLoginCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoLoginCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
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

    let image = null;
    if (kakaoUserInfo.data.kakao_account.profile_image_needs_agreement) {
      image = kakaoUserInfo.data.properties.profile_image;
    }

    const oauth = await this.oauthService.findByExternalId(externalId);

    if (oauth && !oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId, email, image);

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
      const encryptOauthId = await this.authService.encrypt(String(createOauth.id));
      const signupAccessToken = await this.authService.signupAccessToken(encryptOauthId, email, image);

      return { type: 'signup', signupAccessToken, email };
    }

    if (oauth.userId) {
      const encryptOauthId = await this.authService.encrypt(String(oauth.id));

      const userStatus = await this.userService.findUserStatusById(oauth.userId);

      if (userStatus === 'inactive') {
        throw new ForbiddenException('탈퇴하여 30일동안 보관중인 계정입니다.', 'ACCESS_DENIED');
      }

      const accessToken = await this.authService.createAccessToken(encryptOauthId);
      const refreshToken = await this.authService.createRefreshToken(encryptOauthId);

      this.authService.saveRefreshToken(oauth.userId, refreshToken);

      return { type: 'login', accessToken, refreshToken };
    }
  }
}
