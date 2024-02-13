import { Module } from '@nestjs/common';
import { PartyController } from './interface/party.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyEntity } from './infra/db/entity/party/party.entity';
import { PartyFactory } from './domain/party/party.factory';
import { PartyRepository } from './infra/db/repository/party.repository';
import { CreatePartyHandler } from './application/command/create-party.handler';
import { PartyUserRepository } from './infra/db/repository/party-user.repository';
import { GetPartiessHandler } from './application/query/get-parties.handler';
import { GetUserHandler } from './application/query/get-party.handler';
import { PartyUserEntity } from './infra/db/entity/party/party-user.entity';
import { UpdatePartyHandler } from './application/command/update-party.handler';
import { DeletePartyHandler } from './application/command/delete-party.handler';
import { CreateCommentHandler } from './application/command/create-comment.handler';
import { PartyCommentRepository } from './infra/db/repository/party-comment.repository';
import { PartyLikeEntity } from './infra/db/entity/party/party-like.entity';
import { PartyCommentEntity } from './infra/db/entity/party/party-comment.entity';
import { PartyLikeRepository } from './infra/db/repository/party-like.repository';

const commandHandlers = [CreatePartyHandler, UpdatePartyHandler, DeletePartyHandler, CreateCommentHandler];

const queryHandlers = [GetPartiessHandler, GetUserHandler];

const eventHandlers = [];

const factories = [PartyFactory];

const repositories = [
  { provide: 'PartyRepository', useClass: PartyRepository },
  { provide: 'PartyUserRepository', useClass: PartyUserRepository },
  { provide: 'PartyLikeRepository', useClass: PartyLikeRepository },
  { provide: 'PartyCommentRepositor', useClass: PartyCommentRepository },
];

@Module({
  controllers: [PartyController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  imports: [CqrsModule, TypeOrmModule.forFeature([PartyEntity, PartyUserEntity, PartyLikeEntity, PartyCommentEntity])],
})
export class PartyModule {}
