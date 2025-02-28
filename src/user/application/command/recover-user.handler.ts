import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserFactory } from '../../domain/user/user.factory';
import { AuthService } from 'src/auth/auth.service';
import { OauthService } from 'src/auth/oauth.service';
import { RecoverUserCommand } from './recover-user.command';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';

@Injectable()
@CommandHandler(RecoverUserCommand)
export class RecoverUserHandler implements ICommandHandler<RecoverUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
    private oauthService: OauthService,
  ) {}

  async execute(command: RecoverUserCommand) {
    const { userId, oauthId } = command;

    await this.userRepository.setUserActiveById(userId);

    const encryptOauthId = await this.authService.encrypt(String(oauthId));
    const accessToken = await this.authService.createAccessToken(encryptOauthId);
    const refreshToken = await this.authService.createRefreshToken(encryptOauthId);
    this.authService.saveRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
