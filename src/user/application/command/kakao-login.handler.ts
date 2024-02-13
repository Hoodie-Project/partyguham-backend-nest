import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { AuthService } from 'src/auth/auth.service';
import { KakaoLoginCommand } from './kakao-login.command';
import axios from 'axios';

@Injectable()
@CommandHandler(KakaoLoginCommand)
export class KakaoLoginHandler implements ICommandHandler<KakaoLoginCommand> {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  async execute({ accessToken }: KakaoLoginCommand) {
    let userId: number;

    const kakaoUserInfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const user = await this.userRepository.findByAccount(kakaoUserInfo.data.id);
    if (!user) {
      const save = await this.userRepository.create(
        kakaoUserInfo.data.id,
        kakaoUserInfo.data.kakao_account.name,
        kakaoUserInfo.data.kakao_account.email,
      );
      userId = save.id;
    } else {
      userId = user.getId();
    }

    const encryptUserId = await this.authService.encrypt(String(userId));

    const createAccessToken = await this.authService.createAccessToken(encryptUserId);
    const createRefreshToken = await this.authService.createRefreshToken(encryptUserId);

    this.authService.saveRefreshToken(userId, createRefreshToken);

    return { accessToken: createAccessToken, refreshToken: createRefreshToken };
  }
}
