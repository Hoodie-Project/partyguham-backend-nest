import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { AuthService } from 'src/auth/auth.service';
import { OauthService } from 'src/auth/oauth.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
    private oauthService: OauthService,
  ) {}

  async execute(command: CreateUserCommand) {
    const { oauthId, nickname, email, gender, birth } = command;

    const checkEmail = await this.userRepository.findByEmail(email);
    if (checkEmail) {
      throw new ConflictException('이미 존재하는 이메일 입니다.');
    }

    const checkNickname = await this.userRepository.findByNickname(nickname);
    if (checkNickname) {
      throw new ConflictException('이미 존재하는 닉네임 입니다.');
    }

    const user = await this.userRepository.createUser(nickname, email, gender, birth);
    const userId = user.getId();
    await this.oauthService.updateUserIdById(oauthId, userId);

    const encryptOauthId = await this.authService.encrypt(String(oauthId));

    const accessToken = await this.authService.createAccessToken(encryptOauthId);
    const refreshToken = await this.authService.createRefreshToken(encryptOauthId);
    this.authService.saveRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
