import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteUserCommand } from './delete-user.command';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(@Inject('UserRepository') private userRepository: IUserRepository) {}

  async execute(command: DeleteUserCommand) {
    const { id } = command;
    this.userRepository.softDeleteUser(id);
  }
}
