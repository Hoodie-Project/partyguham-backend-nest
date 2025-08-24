import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';
import { OauthService } from 'src/auth/oauth.service';

import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { RecoverUserWebCommand } from './recover-user.web.command';

@Injectable()
@CommandHandler(RecoverUserWebCommand)
export class RecoverUserWebHandler implements ICommandHandler<RecoverUserWebCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
    private oauthService: OauthService,
  ) {}

  async execute(command: RecoverUserWebCommand) {
    const { userId, userExternalId } = command;

    await this.userRepository.setUserActiveById(userId);

    const accessToken = await this.authService.createAccessToken(userExternalId);
    const refreshToken = await this.authService.createRefreshToken(userExternalId);

    this.authService.saveRefreshToken(userId, 'web', refreshToken);

    return { accessToken, refreshToken };
  }
}
