import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationModule } from 'src/notification/notification.module';
import { PositionModule } from 'src/position/position.module';
import { ImageModule } from 'src/libs/image/image.module';

import { PartyFactory } from './domain/party/party.factory';

import { PartyController } from './interface/controller/party.controller';
import { PartyAdminController } from './interface/controller/party-admin.controller';
import { PartyApplicationController } from './interface/controller/party-application.controller';
import { PartyLandingController } from './interface/controller/party-landing.controller';
import { PartyRecruitmentController } from './interface/controller/party-recruitment.controller';

import { PartyUserService } from './application/party-user.service';
import { PartyService } from './application/party.service';
import { PartyApplicationService } from './application/party-application.service';

import { PartyEntity } from './infra/db/entity/party/party.entity';
import { PartyUserEntity } from './infra/db/entity/party/party_user.entity';
import { PartyApplicationEntity } from './infra/db/entity/apply/party_application.entity';
import { PartyInvitationEntity } from './infra/db/entity/apply/party_invitation.entity';
import { PartyTypeEntity } from './infra/db/entity/party/party_type.entity';
import { PartyRecruitmentEntity } from './infra/db/entity/apply/party_recruitment.entity';

import { PartyRepository } from './infra/db/repository/party/party.repository';
import { PartyRecruitmentRepository } from './infra/db/repository/apply/party_recruitment.repository';
import { PartyUserRepository } from './infra/db/repository/party/party_user.repository';
import { PartyTypeRepository } from './infra/db/repository/party/party_type.repository';
import { PartyApplicationRepository } from './infra/db/repository/apply/party_application.repository';

import { GetPartiesHandler } from './application/query/get-parties.handler';
import { GetPartyHandler } from './application/query/get-party.handler';
import { GetPartyTypesHandler } from './application/query/get-partyTypes.handler';
import { UpdatePartyHandler } from './application/command/admin/update-party.handler';
import { DeletePartyHandler } from './application/command/admin/delete-party.handler';
import { CreatePartyHandler } from './application/command/create-party.handler';
import { CreatePartyApplicationHandler } from './application/command/apply/create-partyApplication.handler';

import { GetPartyRecruitmentsHandler } from './application/query/get-partyRecruitments.handler';
import { UpdatePartyRecruitmentHandler } from './application/command/admin/update-partyRecruitment.handler';
import { DeletePartyRecruitmentHandler } from './application/command/admin/delete-partyRecruitment.handler';
import { GetPartyApplicationsHandler } from './application/query/get-partyApplications.handler';

import { RejectionPartyApplicationHandler } from './application/command/apply/rejection-partyApplication.handler';

import { LeavePartyHandler } from './application/command/leave-party.handler';
import { UpdatePartyUserHandler } from './application/command/admin/update-partyUser.handler';
import { GetPartyUserHandler } from './application/query/get-partyUser.handler';
import { GetPartyRecruitmentHandler } from './application/query/get-partyRecruitment.handler';
import { GetAdminPartyUserHandler } from './application/query/get-admin-partyUser.handler';
import { GetRecruitmentsHandler } from './application/query/get-recruitments.handler';
import { GetRecruitmentsPersonalizedHandler } from './application/query/get-recruitmentsPersonalized.handler';
import { BatchDeletePartyRecruitmentHandler } from './application/command/admin/batchDelete-partyRecruitment.handler';

import { GetPartyUserAuthorityHandler } from './application/query/get-partyUserAuthority.handler';
import { GetSearchHandler } from './application/query/get-search.handler';
import { ApproveAdminPartyApplicationHandler } from './application/command/admin/approve-adminPartyApplication.handler';
import { RejectionAdminPartyApplicationHandler } from './application/command/admin/rejection-adminPartyApplication.handler';
import { DelegatePartyApplicationHandler } from './application/command/admin/delegate-party.handler';

import { GetPartyApplicationMeHandler } from './application/query/get-partyApplicationMe.handler';
import { CompletedAdminPartyRecruitmentHandler } from './application/command/admin/completed-adminPartyRecruitment.handler';
import { UpdatePartyRecruitmentBatchStatusHandler } from './application/command/update-partyRecruitmentBatchStatus.handler';
import { DeletePartyUserHandler } from './application/command/admin/delete-partyUser.handler';
import { DeletePartyUsersHandler } from './application/command/admin/delete-partyUsers.handler';
import { DeletePartyImageHandler } from './application/command/admin/delete-partyImage.handler';
import { CreatePartyRecruitmentHandler } from './application/command/recruitment/create-partyRecruitment.handler';
import { ApprovePartyApplicationHandler } from './application/command/apply/approve-partyApplication.handler';
import { DeletePartyApplicationHandler } from './application/command/apply/delete-partyApplication.handler';
import { UpdatePartyStatusHandler } from './application/command/admin/update-partyStatus.handler';

const commandHandlers = [
  CreatePartyHandler,
  UpdatePartyHandler,
  UpdatePartyStatusHandler,
  DeletePartyHandler,
  DeletePartyUserHandler,
  DeletePartyUsersHandler,
  UpdatePartyUserHandler,
  DeletePartyImageHandler,
  CreatePartyRecruitmentHandler,
  UpdatePartyRecruitmentHandler,
  DeletePartyRecruitmentHandler,
  BatchDeletePartyRecruitmentHandler,
  UpdatePartyRecruitmentBatchStatusHandler,
  CreatePartyApplicationHandler,
  LeavePartyHandler,

  ApproveAdminPartyApplicationHandler,
  RejectionAdminPartyApplicationHandler,
  CompletedAdminPartyRecruitmentHandler,
  ApprovePartyApplicationHandler,
  RejectionPartyApplicationHandler,
  DeletePartyApplicationHandler,
  DelegatePartyApplicationHandler,
];

const queryHandlers = [
  GetSearchHandler,
  GetPartiesHandler,
  GetPartyHandler,
  GetPartyUserHandler,
  GetPartyUserAuthorityHandler,
  GetAdminPartyUserHandler,
  GetPartyTypesHandler,
  GetRecruitmentsHandler,
  GetRecruitmentsPersonalizedHandler,
  GetPartyRecruitmentsHandler,
  GetPartyRecruitmentHandler,
  GetPartyApplicationsHandler,
  GetPartyApplicationMeHandler,
];
const services = [PartyService, PartyUserService, PartyApplicationService];
const eventHandlers = [];
const factories = [PartyFactory];

const repositories = [
  { provide: 'PartyRepository', useClass: PartyRepository },
  { provide: 'PartyUserRepository', useClass: PartyUserRepository },
  { provide: 'PartyTypeRepository', useClass: PartyTypeRepository },
  { provide: 'PartyRecruitmentRepository', useClass: PartyRecruitmentRepository },
  { provide: 'PartyApplicationRepository', useClass: PartyApplicationRepository },
];

@Module({
  controllers: [
    PartyLandingController,
    PartyController,
    PartyAdminController,
    PartyRecruitmentController,
    PartyApplicationController,
  ],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories, ...services],
  exports: [...services, TypeOrmModule],
  imports: [
    // ImageModule.register('party'),
    TypeOrmModule.forFeature([
      PartyEntity,
      PartyTypeEntity,
      PartyUserEntity,
      PartyRecruitmentEntity,
      PartyApplicationEntity,
      PartyInvitationEntity,
    ]),
    CqrsModule,
    NotificationModule,
    PositionModule,
    forwardRef(() => UserModule), // 유저 <-> 파티 순환참조 사용
  ],
})
export class PartyModule {}
