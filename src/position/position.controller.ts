import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  @Get('')
  @ApiOperation({ summary: '포지션 항목 조회' })
  @ApiResponse({
    status: 200,
    description: '포지션 항목을 조회 하였습니다.',
  })
  async getSkill(): Promise<void> {}
}
