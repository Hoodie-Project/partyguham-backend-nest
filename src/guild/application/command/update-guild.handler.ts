import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GuildUpdateCommand } from './update-guild.comand';
import { IGuildRepository } from 'src/guild/domain/guild/repository/iGuild.repository';
import { IGuildUserRepository } from 'src/guild/domain/guild/repository/iGuildUser.repository';
import { GuildFactory } from 'src/guild/domain/guild/guild.factory';

@Injectable()
@CommandHandler(GuildUpdateCommand)
export class GuildUpdateHandler implements ICommandHandler<GuildUpdateCommand> {
  constructor(
    private guildFactory: GuildFactory,
    @Inject('GuildRepository') private guildRepository: IGuildRepository,
    @Inject('GuildUserRepository') private guildUserRepository: IGuildUserRepository,
  ) {}

  async execute(command: GuildUpdateCommand) {
    const { userId, guildId, title, content } = command;
    const partyUser = await this.guildUserRepository.findOne(userId, guildId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    const party = await this.guildRepository.update(guildId, title, content);

    return party;
  }
}
