import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserFactory } from '../../domain/user/user.factory';
import { FollowCommand } from './follow.command';
import { IFollowRepository } from 'src/user/domain/follow/repository/iFollow.repository';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';

@Injectable()
@CommandHandler(FollowCommand)
export class FollowHandler implements ICommandHandler<FollowCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('FollowRepository') private followRepository: IFollowRepository,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: FollowCommand) {
    const { userId, nickname } = command;

    const followUser = await this.userRepository.findByNickname(nickname);
    if (!followUser) {
      throw new BadRequestException('유효하지 않는 유저 입니다.');
    }

    const result = await this.followRepository.create(userId, followUser.id);

    return result;
  }
}
