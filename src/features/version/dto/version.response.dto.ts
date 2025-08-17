import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VersionResponseDto {
  @Expose()
  @ApiProperty({ example: 'android', description: '플랫폼 (android 또는 ios)' })
  platform: string;

  @Expose()
  @ApiProperty({ example: '1.2.3', description: '최신 버전' })
  latestVersion: string;

  @Expose()
  @ApiProperty({ example: '1.0.0', description: '최소 필수 버전', required: false })
  minRequiredVersion?: string;

  @Expose()
  @ApiProperty({ example: '버그 수정 및 성능 개선', description: '릴리즈 노트', required: false })
  releaseNotes?: string;

  @Expose()
  @ApiProperty({ example: false, description: '강제 업데이트 여부' })
  isForceUpdate: boolean;

  @Expose()
  @ApiProperty({ example: 'https://example.com/app.apk', description: '앱 다운로드 URL', required: false })
  downloadUrl?: string;
}
