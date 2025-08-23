import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';

import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { AuthService } from 'src/auth/auth.service';
import { OauthService } from 'src/auth/oauth.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
    private oauthService: OauthService,
  ) {}

  async execute(command: CreateUserCommand) {
    const { oauthId, email, image, nickname, gender, birth } = command;

    const checkNickname = await this.userRepository.findByNickname(nickname);
    if (checkNickname) {
      throw new ConflictException('이미 존재하는 닉네임 입니다.');
    }

    const user = await this.userRepository.createUser(email, image, nickname, gender, birth);
    const userId = user.id;
    await this.oauthService.updateUserIdById(oauthId, userId);

    const accessToken = await this.authService.createAccessToken(oauthId);
    const refreshToken = await this.authService.createRefreshToken(userId);

    // this.authService.saveRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
