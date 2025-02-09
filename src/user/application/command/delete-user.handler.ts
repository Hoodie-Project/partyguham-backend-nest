import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteUserCommand } from './delete-user.command';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { PartyApplicationService } from 'src/party/application/party-application.service';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private partyApplicationService: PartyApplicationService,
  ) {}

  async execute(command: DeleteUserCommand) {
    const { userId } = command;
    // 유저 삭제
    await this.userRepository.softDeleteUserById(userId);
    // 파티 지원 삭제
    await this.partyApplicationService.deletePartyApplicationByUserId(userId);

    return;
  }
}
