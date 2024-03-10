import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Get('')
  @ApiOperation({ summary: '포지션 항목 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '포지션 항목을 조회 하였습니다.',
  })
  async getPositions() {
    const result = await this.positionService.findAll();

    return result;
  }
}
