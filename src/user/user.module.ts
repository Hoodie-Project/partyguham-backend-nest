import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './interface/controller/user.controller';
import { UserService } from './application/user.service';

import { UserEntity } from './infra/db/entity/user.entity';
import { UserFactory } from './domain/user/user.factory';
import { UserRepository } from './infra/db/repository/user.repository';
import { UserPersonalityRepository } from './infra/db/repository/user_personality.repository';
import { UserCareerRepository } from './infra/db/repository/user_career.repository';

import { AuthModule } from 'src/auth/auth.module';
import { ImageModule } from 'src/libs/image/image.module';
import { PartyModule } from 'src/party/party.module';
import { KakaoLoginHandler } from './application/command/kakao-login.handler';
import { LocationModule } from 'src/location/location.module';
import { PositionModule } from 'src/position/position.module';
import { PersonalityModule } from 'src/personality/personality.module';

import { CreateUserHandler } from './application/command/create-user.handler';
import { KakaoCodeHandler } from './application/command/kakao-code.handler';
import { GetUserHandler } from './application/query/get-user.handler';
import { GetUsersHandler } from './application/query/get-users.handler';
import { UserByNicknameHandler } from './application/query/get-user-by-nickname.handler';
import { CreateUserLocationHandler } from './application/command/create.userLocation.handler';
import { CreateUserPersonalityHandler } from './application/command/create.userPersonality.handler';
import { CreateUserCareerHandler } from './application/command/create-userCareer.handler';
import { UserLocationRepository } from './infra/db/repository/user_location.repository';
import { UserLocationEntity } from './infra/db/entity/user_location.entity';
import { UserCareerEntity } from './infra/db/entity/user_career.entity';
import { UserPersonalityEntity } from './infra/db/entity/user_personality.entity';
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
import { GetMyPartyApplicationHandler } from './application/query/get-myPartyApplications.handler';
import { LinkOauthHandler } from './application/command/link-oauth.handler';
import { GetUserOauthHandler } from './application/query/get-userOauth.handler';
import { KakaoLinkLoginHandler } from './application/command/kakaoLink-login.handler';
import { KakaoLinkCodeHandler } from './application/command/kakaoLink-code.handler';
import { UpdateUserHandler } from './application/command/update-user.handler';
import { GoogleLinkCodeHandler } from './application/command/googleLink-code.handler';
import { GoogleLinkLoginHandler } from './application/command/googleLink-login.handler';
import { KakaoAppLinkHandler } from './application/command/kakao-app-link.handler';
import { GoogleAppLinkHandler } from './application/command/google-app-link.handler';
import { UpdateUserCareerHandler } from './application/command/update-userCareer.handler';
import { GetUserCareerHandler } from './application/query/get-userCareer.handler';
import { RecoverUserHandler } from './application/command/recover-user.handler';

import { WebOauthController } from './interface/controller/web-oauth.controller';
import { AppOauthController } from './interface/controller/app-oauth.controller';
import { GetMyPartiesHandler } from './application/query/get-myParties.handler';
import { UserStatusController } from './interface/controller/user-status.controller';
import { UserDetailsController } from './interface/controller/user-details.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { GetUserLocationHandler } from './application/query/get-userLocation.handler';

const commandHandlers = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,

  KakaoCodeHandler,
  KakaoLoginHandler,
  KakaoLinkLoginHandler,
  KakaoLinkCodeHandler,
  KakaoAppLoginHandler,
  KakaoAppLinkHandler,

  GoogleCodeHandler,
  GoogleLoginHandler,
  GoogleLinkCodeHandler,
  GoogleLinkLoginHandler,
  GoogleAppLoginHandler,
  GoogleAppLinkHandler,

  LinkOauthHandler,

  CreateUserLocationHandler,
  DeleteUserLocationHandler,
  DeleteUserLocationsHandler,

  CreateUserPersonalityHandler,
  DeleteUserPersonalityHandler,
  DeleteUserPersonalityByQuestionHandler,

  CreateUserCareerHandler,
  UpdateUserCareerHandler,
  DeleteUserCareerHandler,
  DeleteUserCareersHandler,
  RecoverUserHandler,
];

const queryHandlers = [
  GetCheckNicknameHandler,
  UserByNicknameHandler,
  GetUserHandler,
  GetUsersHandler,
  GetUserCareerHandler,
  GetUserLocationHandler,
  GetUserOauthHandler,
  GetMyPartiesHandler,
  GetMyPartyApplicationHandler,
];

const eventHandlers = [];

const factories = [UserFactory];

const repositories = [
  { provide: 'UserRepository', useClass: UserRepository },
  { provide: 'UserLocationRepository', useClass: UserLocationRepository },
  { provide: 'UserPersonalityRepository', useClass: UserPersonalityRepository },
  { provide: 'UserCareerRepository', useClass: UserCareerRepository },
];

@Module({
  controllers: [WebOauthController, AppOauthController, UserStatusController, UserController, UserDetailsController],
  providers: [UserService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  exports: [UserService, ...repositories],
  imports: [
    // ImageModule.register('user'),
    TypeOrmModule.forFeature([UserEntity, UserLocationEntity, UserCareerEntity, UserPersonalityEntity]),
    CqrsModule,
    AuthModule,
    PositionModule,
    LocationModule,
    PersonalityModule,
    NotificationModule,
    forwardRef(() => PartyModule), // 유저 <-> 파티 순환참조 사용
  ],
})
export class UserModule {}
