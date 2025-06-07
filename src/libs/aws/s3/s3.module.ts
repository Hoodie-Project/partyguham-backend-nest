import { Module } from '@nestjs/common';
import { UploadController } from './s3.controller';
import { S3Service } from './s3.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register()],
  controllers: [UploadController],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
