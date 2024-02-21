import { ICommand } from '@nestjs/cqrs';
import { OnlineStatus } from 'src/user/infra/db/entity/user.entity';

export class UpdateUserCommand implements ICommand {
  constructor(
    readonly id: number,
    readonly onlineStatus: OnlineStatus,
  ) {}
}
