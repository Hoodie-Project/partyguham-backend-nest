import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ImageService } from './image.service';

@Module({})
export class ImageModule {
  static register(moduleName: string): DynamicModule {
    const uploadDir = path.join(process.cwd(), 'images', moduleName);
    const mainRoot = process.env.MODE_ENV === 'prod' ? '/api' : '/dev/api';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return {
      module: ImageModule,
      imports: [
        ServeStaticModule.forRoot({
          rootPath: uploadDir,
          serveRoot: `${mainRoot}/images/${moduleName}`,
        }),
        MulterModule.register({
          storage: diskStorage({
            destination: (_, __, cb) => cb(null, uploadDir),
            filename: (_, file, cb) => {
              const ext = path.extname(file.originalname);
              const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
              cb(null, unique);
            },
          }),
          fileFilter: (_, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
              return cb(new Error('Only JPG, JPEG, PNG files are allowed!'), false);
            }
            cb(null, true);
          },
        }),
      ],
      providers: [ImageService],
      exports: [ImageService, MulterModule],
    };
  }
}
