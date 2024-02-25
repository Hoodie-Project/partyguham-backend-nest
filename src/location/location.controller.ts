import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationController {
  @Get('')
  @ApiOperation({ summary: '장소 항목 조회' })
  @ApiResponse({
    status: 200,
    description: '장소 리스트 조회 하였습니다.',
  })
  async getLocations(): Promise<void> {}
}
