import * as fs from 'fs';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from 'src/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { diskStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PartyFactory } from './domain/party/party.factory';

import { PartyController } from './interface/party.controller';
import { PartyApplicationController } from './interface/party-application.controller';
import { PartyLandingController } from './interface/party-landing.controller';
import { PartyRecruitmentController } from './interface/party-recruitment.controller';

import { PartyEntity } from './infra/db/entity/party/party.entity';
import { PartyUserEntity } from './infra/db/entity/party/party_user.entity';
import { PartyApplicationEntity } from './infra/db/entity/apply/party_application.entity';
import { PartyInvitationEntity } from './infra/db/entity/apply/party_invitation.entity';
import { PartyTypeEntity } from './infra/db/entity/party/party_type.entity';

import { PartyRepository } from './infra/db/repository/party.repository';
import { PartyRecruitmentRepository } from './infra/db/repository/party_recruitment.repository';
import { PartyUserRepository } from './infra/db/repository/party_user.repository';
import { PartyTypeRepository } from './infra/db/repository/party_type.repository';
import { PartyApplicationRepository } from './infra/db/repository/party_application.repository';

import { GetPartiesHandler } from './application/query/get-parties.handler';
import { GetPartyHandler } from './application/query/get-party.handler';
import { GetPartyTypesHandler } from './application/query/get-partyTypes.handler';
import { UpdatePartyHandler } from './application/command/update-party.handler';
import { DeletePartyHandler } from './application/command/delete-party.handler';
import { CreatePartyHandler } from './application/command/create-party.handler';
import { CreatePartyApplicationHandler } from './application/command/create-partyApplication.handler';
import { CreatePartyRecruitmentHandler } from './application/command/create-partyRecruitment.handler';
import { PartyRecruitmentEntity } from './infra/db/entity/apply/party_recruitment.entity';
import { DeletePartyImageHandler } from './application/command/delete-partyImage.handler';
import { GetPartyRecruitmentsHandler } from './application/query/get-partyRecruitments.handler';
import { UpdatePartyRecruitmentHandler } from './application/command/update-partyRecruitment.handler';
import { DeletePartyRecruitmentHandler } from './application/command/delete-partyRecruitment.handler';
import { GetPartyApplicationsHandler } from './application/query/get-partyApplications.handler';
import { ApprovePartyApplicationHandler } from './application/command/approve-partyApplication.handler';
import { RejectionPartyApplicationHandler } from './application/command/rejection-partyApplication.handler';
import { DeletePartyUserHandler } from './application/command/delete-partyUser.handler';
import { LeavePartyHandler } from './application/command/leave-party.handler';
import { EndPartyHandler } from './application/command/end-party.handler';
import { ActivePartyHandler } from './application/command/active-party.handler';
import { UpdatePartyUserHandler } from './application/command/update-partyUser.handler';
import { GetPartyUserHandler } from './application/query/get-partyUser.handler';
import { GetPartyRecruitmentHandler } from './application/query/get-partyRecruitment.handler';
import { GetAdminPartyUserHandler } from './application/query/get-admin-partyUser.handler';
import { GetRecruitmentsHandler } from './application/query/get-recruitments.handler';
import { GetRecruitmentsPersonalizedHandler } from './application/query/get-recruitmentsPersonalized.handler';
import { BatchDeletePartyRecruitmentHandler } from './application/command/batchDelete-partyRecruitment.handler';
import { DeletePartyUsersHandler } from './application/command/delete-partyUsers.handler';

const commandHandlers = [
  CreatePartyHandler,
  UpdatePartyHandler,
  DeletePartyHandler,
  EndPartyHandler,
  ActivePartyHandler,
  DeletePartyUserHandler,
  DeletePartyUsersHandler,
  UpdatePartyUserHandler,
  DeletePartyImageHandler,
  CreatePartyRecruitmentHandler,
  UpdatePartyRecruitmentHandler,
  DeletePartyRecruitmentHandler,
  BatchDeletePartyRecruitmentHandler,
  CreatePartyApplicationHandler,
  LeavePartyHandler,
  ApprovePartyApplicationHandler,
  RejectionPartyApplicationHandler,
];

const queryHandlers = [
  GetPartiesHandler,
  GetPartyHandler,
  GetPartyUserHandler,
  GetAdminPartyUserHandler,
  GetPartyTypesHandler,
  GetRecruitmentsHandler,
  GetRecruitmentsPersonalizedHandler,
  GetPartyRecruitmentsHandler,
  GetPartyRecruitmentHandler,
  GetPartyApplicationsHandler,
];
const eventHandlers = [];
const factories = [PartyFactory];

const repositories = [
  { provide: 'PartyRepository', useClass: PartyRepository },
  { provide: 'PartyUserRepository', useClass: PartyUserRepository },
  { provide: 'PartyTypeRepository', useClass: PartyTypeRepository },
  { provide: 'PartyRecruitmentRepository', useClass: PartyRecruitmentRepository },
  { provide: 'PartyApplicationRepository', useClass: PartyApplicationRepository },
];

const mainRoot = process.env.MODE_ENV === 'prod' ? '/api' : '/dev/api';
const uploadDir = 'images/party';

@Module({
  controllers: [PartyLandingController, PartyRecruitmentController, PartyApplicationController, PartyController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
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
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
    TypeOrmModule.forFeature([
      PartyEntity,
      PartyTypeEntity,
      PartyUserEntity,
      PartyRecruitmentEntity,
      PartyApplicationEntity,
      PartyInvitationEntity,
    ]),
    CqrsModule,
    UserModule,
  ],
})
export class PartyModule {}
