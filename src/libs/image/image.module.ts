import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ImageService } from './image.service';

@Module({})
export class ImageModule {
  static register(moduleName: string): DynamicModule {
    const uploadDir = path.join(process.cwd(), 'images', moduleName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return {
      module: ImageModule,
      imports: [
        MulterModule.register({
          storage: diskStorage({
            destination: (_, __, callback) => callback(null, uploadDir),
            filename: (_, file, callback) => {
              const ext = path.extname(file.originalname);
              const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
              callback(null, unique);
            },
          }),
          fileFilter: (_, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
              return callback(new Error('Only JPG, JPEG, PNG files are allowed!'), false);
            }
            callback(null, true);
          },
        }),
      ],
      providers: [ImageService, { provide: 'UPLOAD_DIR', useValue: uploadDir }],
      exports: [ImageService, MulterModule, 'UPLOAD_DIR'],
    };
  }
}
