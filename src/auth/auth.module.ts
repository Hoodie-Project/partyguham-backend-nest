import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AccessStrategy } from './strategy/access.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { AuthController } from './auth.controller';
import { OauthEntity } from './entity/oauth.entity';
import { OauthRepository } from './repository/oauth.repository';
import { OauthService } from './oauth.service';
import { SignupStrategy } from './strategy/signup.strategy';
import { RecoverStrategy } from './strategy/recover.strategy';
import { CommonUserService } from 'src/user/application/common.user.service';

@Module({
  controllers: [AuthController],
  providers: [
    AccessStrategy,
    RefreshStrategy,
    SignupStrategy,
    RecoverStrategy,
    OauthRepository,
    AuthService,
    OauthService,
  ],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([OauthEntity]),
    CommonUserService,
  ],
  exports: [AuthService, OauthService],
})
export class AuthModule {}
