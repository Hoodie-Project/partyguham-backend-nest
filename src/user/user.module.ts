import { Module } from '@nestjs/common';
import { UserController } from './interface/user.controller';
import { UserService } from './application/user.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { CreateUserHandler } from './application/command/create-user.handler';
import { KakaoLoginHandler } from './application/command/kakao-login.handler';
import { GetUserHandler } from './application/query/get-user.handler';
import { UserFactory } from './domain/user/user.factory';
import { UserRepository } from './infra/db/repository/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { GetUsersHandler } from './application/query/get-users.handler';
import { UserByNicknameHandler } from './application/query/get-user-by-nickname.handler';
import { FollowHandler } from './application/command/follow.handler';
import { UnFollowHandler } from './application/command/unfollow.handler';
import { FollowRepository } from './infra/db/repository/follow.repository';
import { FollowEntity } from './infra/db/entity/follow.entity';
import { FollowFactory } from './domain/follow/follow.factory';
import { GetFollowHandler } from './application/query/get-follow.handler';
import { UserSkillRepository } from './infra/db/repository/user-skill.repository';
import { UserSkillEntity } from './infra/db/entity/user-skill.entity';

const commandHandlers = [CreateUserHandler, KakaoLoginHandler, FollowHandler, UnFollowHandler];

const queryHandlers = [UserByNicknameHandler, GetUserHandler, GetUsersHandler, GetFollowHandler];

const eventHandlers = [];

const factories = [UserFactory, FollowFactory];

const repositories = [
  { provide: 'UserRepository', useClass: UserRepository },
  { provide: 'FollowRepository', useClass: FollowRepository },
  { provide: 'UserSkillRepository', useClass: UserSkillRepository },
];

@Module({
  controllers: [UserController],
  providers: [UserService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  imports: [CqrsModule, AuthModule, TypeOrmModule.forFeature([UserEntity, FollowEntity, UserSkillEntity])],
})
export class UserModule {}
