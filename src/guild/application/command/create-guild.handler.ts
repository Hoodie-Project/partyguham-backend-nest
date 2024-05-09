import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateGuildCommand } from './create-guild.comand';

import { GuildFactory } from 'src/guild/domain/guild/guild.factory';
import { IGuildRepository } from 'src/guild/domain/guild/repository/iGuild.repository';
import { IGuildUserRepository } from 'src/guild/domain/guild/repository/iGuildUser.repository';

@Injectable()
@CommandHandler(CreateGuildCommand)
export class CreateGuildHandler implements ICommandHandler<CreateGuildCommand> {
  constructor(
    private guildFactory: GuildFactory,
    @Inject('GuildRepository') private guildRepository: IGuildRepository,
    @Inject('GuildUserRepository') private guildUserRepository: IGuildUserRepository,
  ) {}

  async execute(command: CreateGuildCommand) {
    const { userId, title, content } = command;

    const party = await this.guildRepository.create(title, content);

    await this.guildUserRepository.createMaster(userId, party.getId());

    return party;
  }
}
