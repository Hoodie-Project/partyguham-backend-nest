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

    const accessToken = await this.authService.createAccessToken(oauthId);
    const refreshToken = await this.authService.createRefreshToken(userId);
    // this.authService.saveRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
