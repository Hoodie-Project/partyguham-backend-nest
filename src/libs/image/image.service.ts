import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  constructor(@Inject('UPLOAD_DIR') private readonly uploadDir: string) {}

  getUploadPath(): string {
    return this.uploadDir;
  }

  /**
   * DB에 저장된 상대 경로(/images/user/filename)를 받아서 실제 파일 삭제
   */
  deleteImage(relativePath: string): void {
    const filePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * 파일명을 받아서 실제 경로 반환 (/images/user/abc.png → /your/project/root/images/user/abc.png)
   */
  getFullPath(relativePath: string): string {
    return path.join(process.cwd(), relativePath);
  }

  /**
   * 파일이 존재하는지 확인
   */
  exists(relativePath: string): boolean {
    const fullPath = this.getFullPath(relativePath);
    return fs.existsSync(fullPath);
  }

  /**
   * 절대 경로에서 상대 경로(/images/user/filename.png)만 추출
   */
  getRelativePath(absolutePath: string): string {
    return path.relative(process.cwd(), absolutePath);
  }
}
