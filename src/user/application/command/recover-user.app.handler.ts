import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';
import { OauthService } from 'src/auth/oauth.service';
import { RecoverUserAppCommand } from './recover-user.app.command';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';

@Injectable()
@CommandHandler(RecoverUserAppCommand)
export class RecoverUserAppHandler implements ICommandHandler<RecoverUserAppCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
    private oauthService: OauthService,
  ) {}

  async execute(command: RecoverUserAppCommand) {
    const { userId, userExternalId } = command;

    await this.userRepository.setUserActiveById(userId);

    const accessToken = await this.authService.createAccessToken(userExternalId);
    const refreshToken = await this.authService.createRefreshToken(userExternalId);

    this.authService.saveRefreshToken(userId, 'app', refreshToken);

    return { accessToken, refreshToken };
  }
}
