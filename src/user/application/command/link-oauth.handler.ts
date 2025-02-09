import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { AuthService } from 'src/auth/auth.service';
import { OauthService } from 'src/auth/oauth.service';
import { LinkOauthCommand } from './link-oauth.command';

@Injectable()
@CommandHandler(LinkOauthCommand)
export class LinkOauthHandler implements ICommandHandler<LinkOauthCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
    private oauthService: OauthService,
  ) {}

  async execute(command: LinkOauthCommand) {
    const { userId, signupToken } = command;

    const oauthId = await this.authService.validateSignupAccessToken(signupToken);

    const result = await this.oauthService.updateUserIdById(oauthId, userId);

    return result;
  }
}
