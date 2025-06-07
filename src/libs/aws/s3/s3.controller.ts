// upload.controller.ts
import { BadRequestException, Controller, Delete, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }

    const url = await this.s3Service.uploadFile(file, 'test');
    return { url };
  }

  @Delete()
  async delete(@Query('image') query) {
    const url = await this.s3Service.deleteFile(query);

    return url;
  }
}
