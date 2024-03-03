import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async execute({}: KakaoLoginCommand) {
    const kakaoRestApiKey = process.env.KAKAO_RESTAPI_KEY;
    const kakaoRedirectUri = process.env.KAKAO_REDIRECT_URI;
    return `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoRestApiKey}&redirect_uri=${kakaoRedirectUri}&response_type=code`;
  }
}
