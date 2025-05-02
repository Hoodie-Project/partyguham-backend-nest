import { Global, Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmTokenEntity } from './entity/fcm-token.entity';
import { FcmTokenRepository } from './repository/fcm-token.repository';
import { FcmController } from './fcm.controller';

// 글로벌 모듈 적용
@Global()
@Module({
  controllers: [FcmController],
  providers: [FcmService, FcmTokenRepository],
  imports: [TypeOrmModule.forFeature([FcmTokenEntity])],
  exports: [FcmService],
})
export class FirebaseModule {}
