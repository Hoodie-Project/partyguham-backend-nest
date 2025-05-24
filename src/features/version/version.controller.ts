import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { VersionService } from './version.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VersionResponseDto } from './dto/version.response.dto';
import { GetLatestVersionQueryDto } from './dto/GetLatestVersionQueryDto';
import { plainToInstance } from 'class-transformer';

@ApiTags('version - 버전 관리')
@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get('latest')
  @ApiOperation({ summary: '최신 버전 조회', description: '플랫폼별 최신 앱 버전을 반환합니다.' })
  @ApiQuery({ name: 'platform', type: String, example: 'android', required: true })
  @ApiResponse({ status: 200, description: '성공적으로 버전 정보를 반환함', type: VersionResponseDto })
  async getLatest(@Query() query: GetLatestVersionQueryDto) {
    const result = await this.versionService.getLatestVersion(query.platform);

    if (!result) throw new BadRequestException('버전 정보가 없습니다');

    return plainToInstance(VersionResponseDto, result);
  }
}
