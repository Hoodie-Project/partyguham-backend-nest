import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  deleteImage(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUploadPath(filename: string) {
    return path.join(__dirname, '..', '..', 'uploads', filename);
  }
}
