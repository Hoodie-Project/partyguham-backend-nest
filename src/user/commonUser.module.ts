import { Module } from '@nestjs/common';
import { CommonUserService } from './application/common.user.service';
import { UserRepository } from './infra/db/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';

const repositories = [{ provide: 'UserRepository', useClass: UserRepository }];

@Module({
  providers: [CommonUserService, ...repositories],
  exports: [CommonUserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class CommonUserModule {}
