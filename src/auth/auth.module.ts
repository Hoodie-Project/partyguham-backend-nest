import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { AccessStrategy } from './access.strategy';
import { AuthRepository } from './repository/auth.repository';
import { RefreshStrategy } from './refresh.strategy';
import { AuthController } from './auth.controller';
import { OauthEntity } from './entity/oauth.entity';
import { OauthRepository } from './repository/oauth.repository';
import { OauthService } from './oauth.service';

@Module({
  controllers: [AuthController],
  providers: [AccessStrategy, RefreshStrategy, AuthRepository, OauthRepository, AuthService],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([AuthEntity, OauthEntity]),
  ],
  exports: [AuthService, OauthService],
})
export class AuthModule {}
