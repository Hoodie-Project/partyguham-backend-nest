import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { BannerWebRepository } from './repository/banner_web.repository';
import { BannerAppRepository } from './repository/banner_app.repository';
import { BannerWebEntity } from './entity/banner_web.entity';
import { BannerAppEntity } from './entity/banner_app.entity';

const mainRoot = process.env.MODE_ENV === 'prod' ? '/api' : '/dev/api';
const uploadDir = 'images/banner';

@Module({
  controllers: [BannerController],
  providers: [BannerService, BannerWebRepository, BannerAppRepository],
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
          const filename = `${uniqueSuffix}`;
          callback(null, filename);
        },
      }),
    }),
    TypeOrmModule.forFeature([BannerWebEntity, BannerAppEntity]),
  ],
})
export class BannerModule {}
