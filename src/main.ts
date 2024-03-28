import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CustomErrorExceptionFilter } from './common/exception/error.filter';
import * as fs from 'fs';

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
    origin: '*', //우선 모두 허용
    credentials: true,
  });
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  //docs
  const config = new DocumentBuilder()
    .setTitle('party-guam API')
    .setDescription('base URL - /api')
    .setVersion('1.0')
    .addTag('party-guam')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api'); // 전체 endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CustomErrorExceptionFilter());

  app.use(cookieParser()); // cookie 사용

  await app.listen(process.env.PORT);
  console.log(`listening on port ${process.env.PORT}`);
}
bootstrap();
