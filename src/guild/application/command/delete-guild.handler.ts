import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteGuildCommand } from './delete-guild.comand';
import { IGuildRepository } from 'src/guild/domain/guild/repository/iGuild.repository';
import { IGuildUserRepository } from 'src/guild/domain/guild/repository/iGuildUser.repository';
import { GuildFactory } from 'src/guild/domain/guild/guild.factory';

@Injectable()
@CommandHandler(DeleteGuildCommand)
export class DeleteGuildHandler implements ICommandHandler<DeleteGuildCommand> {
  constructor(
    private guildFactory: GuildFactory,
    @Inject('GuildRepository') private partyRepository: IGuildRepository,
    @Inject('GuildUserRepository') private partyUserRepository: IGuildUserRepository,
  ) {}

  async execute(command: DeleteGuildCommand) {
    const { userId, guildId } = command;
    const partyUser = await this.partyUserRepository.findOne(userId, guildId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.partyRepository.delete(guildId);
  }
}
