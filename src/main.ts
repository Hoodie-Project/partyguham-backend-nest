import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import * as fs from 'fs';
import session from 'express-session';

import cookieParser from 'cookie-parser';
import * as passport from 'passport';

declare module 'express-session' {
  interface SessionData {
    email: string;
    image: string;
  }
}

async function bootstrap() {
  const httpsOptions =
    process.env.MODE_ENV === 'local'
      ? null
      : {
          ca: fs.readFileSync(process.env.CA_REPO),
          key: fs.readFileSync(process.env.KEY_REPO),
          cert: fs.readFileSync(process.env.CERT_REPO),
        };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors({
    methods: 'GET,PUT,PATCH,POST,DELETE',
    origin: ['https://localhost:3000', 'https://partyguham.com', 'http://partyguham.com'],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET, //세션아이디
      resave: false, //세션이 수정되지 않아도 지속적으로 저장하게 하는 옵션
      saveUninitialized: false, //초기화되지 않는 세션을 저장하게 함
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: process.env.MODE_ENV === 'prod' ? 'strict' : 'none',
        maxAge: 3600000, // 1시간(밀리초 단위)
      },
    }),
  );

  app.use(cookieParser()); // cookie 사용

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );
  // app.useGlobalFilters(new CustomErrorExceptionFilter());

  const path = process.env.MODE_ENV === 'prod' ? 'api' : 'dev/api';
  app.setGlobalPrefix(`${path}`); // 전체 endpoint

  //docs
  const config = new DocumentBuilder()
    // .setBasePath(`${path}`) // 전역 접두사를 Swagger 문서에 반영
    .addServer(`https://partyguham.com`, '파티괌 도메인 주소')
    .setTitle('party-guham API')
    .setDescription('파티구함 API 문서 입니다.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'accessToken')
    .addCookieAuth('refreshToken', { type: 'apiKey' }, 'refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${path}/docs`, app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 7,
    },
  });

  await app.listen(process.env.PORT);
  console.log(`listening on port ${process.env.PORT}`);
}
bootstrap();
