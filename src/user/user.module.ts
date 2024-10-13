import { Module } from '@nestjs/common';
import { UserController } from './interface/user.controller';
import { UserService } from './application/user.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { CreateUserHandler } from './application/command/create-user.handler';
import { KakaoCodeHandler } from './application/command/kakao-code.handler';
import { GetUserHandler } from './application/query/get-user.handler';
import { UserFactory } from './domain/user/user.factory';
import { UserRepository } from './infra/db/repository/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { GetUsersHandler } from './application/query/get-users.handler';
import { UserByNicknameHandler } from './application/query/get-user-by-nickname.handler';
import { FollowRepository } from './infra/db/repository/follow.repository';
import { FollowEntity } from './infra/db/entity/follow.entity';
import { FollowFactory } from './domain/follow/follow.factory';
import { GetFollowHandler } from './application/query/get-follow.handler';
import { UserSkillRepository } from './infra/db/repository/user_skill.repository';
import { UserSkillEntity } from './infra/db/entity/user_skill.entity';
import { KakaoLoginHandler } from './application/command/kakao-login.handler';
import { LocationModule } from 'src/location/location.module';
import { PositionModule } from 'src/position/position.module';
import { SkillModule } from 'src/skill/skill.module';
import { PersonalityModule } from 'src/personality/personality.module';
import { CreateUserLocationHandler } from './application/command/create.userLocation.handler';
import { CreateUserPersonalityHandler } from './application/command/create.userPersonality.handler';
import { CreateUserCareerHandler } from './application/command/create-userCareer.handler';
import { UserLocationRepository } from './infra/db/repository/user_location.repository';
import { UserLocationEntity } from './infra/db/entity/user_location.entity';
import { UserCareerEntity } from './infra/db/entity/user_career.entity';
import { UserPersonalityEntity } from './infra/db/entity/user_personality.entity';
import { UserPersonalityRepository } from './infra/db/repository/user_personality.repository';
import { UserCareerRepository } from './infra/db/repository/user_career.repository';
import { GetCheckNicknameHandler } from './application/query/get-check-nickname.handler';

import { DeleteUserLocationHandler } from './application/command/delete-userLocation.handler';
import { DeleteUserPersonalityHandler } from './application/command/delete-userPersonality.handler';
import { DeleteUserCareerHandler } from './application/command/delete-userCareer.handler';
import { GoogleCodeHandler } from './application/command/google-code.handler';
import { GoogleLoginHandler } from './application/command/google-login.handler';
import { DeleteUserHandler } from './application/command/delete-user.handler';
import { KakaoAppLoginHandler } from './application/command/kakao-app-login.handler';
import { GoogleAppLoginHandler } from './application/command/google-app-login.handler';
import { DeleteUserLocationsHandler } from './application/command/delete-userLocations.handler';
import { DeleteUserPersonalityByQuestionHandler } from './application/command/delete-userPersonalityByQuestion.handler';
import { DeleteUserCareersHandler } from './application/command/delete-userCareers.handler';
import { WebOauthController } from './interface/web-oauth.controller';
import { AppOauthController } from './interface/app-oauth.controller';

const commandHandlers = [
  CreateUserHandler,
  DeleteUserHandler,

  KakaoCodeHandler,
  KakaoLoginHandler,
  KakaoAppLoginHandler,
  GoogleCodeHandler,
  GoogleLoginHandler,
  GoogleAppLoginHandler,

  CreateUserLocationHandler,
  DeleteUserLocationHandler,
  DeleteUserLocationsHandler,

  CreateUserPersonalityHandler,
  DeleteUserPersonalityHandler,
  DeleteUserPersonalityByQuestionHandler,

  CreateUserCareerHandler,
  DeleteUserCareerHandler,
  DeleteUserCareersHandler,
];

const queryHandlers = [
  GetCheckNicknameHandler,
  UserByNicknameHandler,
  GetUserHandler,
  GetUsersHandler,
  GetFollowHandler,
];

const eventHandlers = [];

const factories = [UserFactory, FollowFactory];

const repositories = [
  { provide: 'UserRepository', useClass: UserRepository },
  { provide: 'FollowRepository', useClass: FollowRepository },
  { provide: 'UserSkillRepository', useClass: UserSkillRepository },
  { provide: 'UserLocationRepository', useClass: UserLocationRepository },
  { provide: 'UserPersonalityRepository', useClass: UserPersonalityRepository },
  { provide: 'UserCareerRepository', useClass: UserCareerRepository },
];

@Module({
  controllers: [WebOauthController, AppOauthController, UserController],
  providers: [UserService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  exports: [UserService, ...repositories],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FollowEntity,
      UserLocationEntity,
      UserCareerEntity,
      UserSkillEntity,
      UserPersonalityEntity,
    ]),
    CqrsModule,
    AuthModule,
    PositionModule,
    LocationModule,
    PersonalityModule,
    SkillModule,
  ],
})
export class UserModule {}
