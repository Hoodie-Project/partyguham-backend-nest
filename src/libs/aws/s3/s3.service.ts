import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  /**
   * Uploads a file to AWS S3 using the given key.
   *
   * @param file - The file object received from Multer (includes buffer, mimetype, etc.).
   * @param key - The S3 key - key.util.ts 파일을 사용하여 값을 넣습니다.
   * @returns The public URL of the uploaded file.
   */
  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * Deletes a file from AWS S3 using the provided key.
   *
   * @param key - The S3 key (path and filename) of the file to delete.
   */
  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      }),
    );
  }
}
