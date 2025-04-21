import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response';
import { NotFoundExceptionFilter } from './common/exception/error-NotFound.filter';
import { CustomErrorExceptionFilter } from './common/exception/error.filter';
import { UnauthorizedExceptionFilter } from './common/exception/error-Unauthorized.filter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { NotificationModule } from './notification/notification.module';
import { FirebaseModule } from './common/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrations: [__dirname + '/**/migrations/*.js'],
      extra: {
        decimalNumbers: true, //decimal number type
      },
      // bigNumberStrings: false, // bigint number type
      namingStrategy: new SnakeNamingStrategy(),
      logging: process.env.MODE_ENV !== 'prod',
    }),
    AuthModule,
    UserModule,
    BannerModule,
    NotificationModule,
    ReportModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
