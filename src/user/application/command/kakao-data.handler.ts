import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { AuthService } from 'src/auth/auth.service';

import axios from 'axios';
import { KakaoDataCommand } from './kakao-data.command';
import { PlatformEnum } from 'src/auth/entity/oauth.entity';
import { OauthService } from 'src/auth/oauth.service';

@Injectable()
@CommandHandler(KakaoDataCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoDataCommand> {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
    private oauthService: OauthService,
    private authService: AuthService,
  ) {}

  async execute({ code }: KakaoDataCommand) {
    const kakao_api_url = await axios.get(
      `https://kauth.kakao.com/oauth/token
    ?grant_type=authorization_code
    &client_id=${process.env.KAKAO_RESTAPI}
    &redirect_url=${process.env.KAKAO_REDIRECT_URI}
    &code=${code}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    const accessToken = await kakao_api_url.data.access_token;

    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const externalId: string = kakaoUserInfo.data.id;

    let userId: number;
    let uuid: string;

    const oauth = await this.oauthService.findByExternalId(externalId);
    if (oauth) {
      userId = oauth.userId;
      uuid = oauth.uuid;
    } else {
      const user = await this.userRepository.prepare();
      const createOauth = await this.oauthService.create(user, externalId, PlatformEnum.KAKAO, accessToken);
      userId = createOauth.userId;
      uuid = createOauth.uuid;
    }

    const createAccessToken = await this.authService.createAccessToken(uuid);
    const createRefreshToken = await this.authService.createRefreshToken(uuid);

    this.authService.saveRefreshToken(userId, createRefreshToken);

    return { accessToken: createAccessToken, refreshToken: createRefreshToken };
  }
}
