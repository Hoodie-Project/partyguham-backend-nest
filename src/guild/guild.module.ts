import { Module } from '@nestjs/common';
import { GuildController } from './interface/guild.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GuildEntity } from './infra/db/entity/guild/guild.entity';
import { GuildUserEntity } from './infra/db/entity/guild/guild_user.entity';

import { GuildFactory } from './domain/guild/guild.factory';

import { CreateGuildHandler } from './application/command/create-guild.handler';
import { DeleteGuildHandler } from './application/command/delete-guild.handler';
import { GetGuildsHandler } from './application/query/get-guilds.handler';
import { GetGuildHandler } from './application/query/get-guild.handler';
import { GuildUpdateHandler } from './application/command/update-guild.handler';

import { GuildRepository } from './infra/db/repository/guild.repository';
import { GuildUserRepository } from './infra/db/repository/guild_user.repository';

const commandHandlers = [CreateGuildHandler, GuildUpdateHandler, DeleteGuildHandler];

const queryHandlers = [GetGuildsHandler, GetGuildHandler];

const eventHandlers = [];

const factories = [GuildFactory];

const repositories = [
  { provide: 'GuildRepository', useClass: GuildRepository },
  { provide: 'GuildUserRepository', useClass: GuildUserRepository },
];

@Module({
  controllers: [GuildController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  imports: [CqrsModule, TypeOrmModule.forFeature([GuildEntity, GuildUserEntity])],
})
export class GuildModule {}
