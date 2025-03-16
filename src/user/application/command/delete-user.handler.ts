import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteUserCommand } from './delete-user.command';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { PartyApplicationService } from 'src/party/application/party-application.service';
import { PartyUserService } from 'src/party/application/party-user.service';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
    private partyApplicationService: PartyApplicationService,
    private partyUserService: PartyUserService,
  ) {}

  async execute(command: DeleteUserCommand) {
    const { userId } = command;
    // 파티장인 파티가 있는지 확인 -> 없으면 탈퇴 막음
    const partyUser = await this.partyUserService.findMasterByUserId(userId);

    if (partyUser.length > 0) {
      throw new ForbiddenException('파티장의 권한이 있어 탈퇴가 불가능 합니다.', 'ACCESS_DENIED');
    }

    // 유저 삭제 상태로 변경
    await this.userRepository.setUserInactiveById(userId);

    return;
  }
}
