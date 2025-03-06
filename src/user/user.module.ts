import * as fs from 'fs';
import * as path from 'path';
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './interface/controller/user.controller';
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
import { WebOauthController } from './interface/controller/web-oauth.controller';
import { AppOauthController } from './interface/controller/app-oauth.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PartyModule } from 'src/party/party.module';
import { GetMyPartiesHandler } from './application/query/get-myParties.handler';
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
import { UserStatusController } from './interface/controller/user-status.controller';
import { UserDetailsController } from './interface/controller/user-details.controller';

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
];

const queryHandlers = [
  GetCheckNicknameHandler,
  UserByNicknameHandler,
  GetUserHandler,
  GetUsersHandler,
  GetUserCareerHandler,
  GetUserOauthHandler,
  GetMyPartiesHandler,
  GetMyPartyApplicationHandler,
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

const mainRoot = process.env.MODE_ENV === 'prod' ? '/api' : '/dev/api';
const uploadDir = 'images/user';

@Module({
  controllers: [WebOauthController, AppOauthController, UserStatusController, UserController, UserDetailsController],
  providers: [UserService, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  exports: [UserService, ...repositories],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: uploadDir, // 정적 파일이 저장된 디렉토리
      serveRoot: mainRoot + '/' + uploadDir, // 정적 파일에 접근할 경로 설정
    }),
    MulterModule.register({
      // dest: '../upload',
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Only JPG files are allowed!'), false);
        }
        callback(null, true);
      },

      storage: diskStorage({
        destination: (req, file, callback) => {
          // 디렉토리가 존재하지 않으면 생성
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); //이미지 파일 이름 랜덤
          const ext = path.extname(file.originalname); // 파일의 확장자를 추출

          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),

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
    forwardRef(() => PartyModule), // 유저 <-> 파티 순환참조 사용
  ],
})
export class UserModule {}
