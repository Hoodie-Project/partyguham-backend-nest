import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { UpdateUserCommand } from './update-user.command';
import { IUserSkillRepository } from 'src/user/domain/user/repository/iuser.skill.repository';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
    @Inject('UserSkillRepository') private userSkillRepository: IUserSkillRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { id, is_party, meeting_type, meeting_week, meeting_time, mbti, skills } = command;
    this.userRepository.update(is_party, meeting_type, meeting_week, meeting_time, mbti);
    this.userSkillRepository.create(id, skills);
  }
}
