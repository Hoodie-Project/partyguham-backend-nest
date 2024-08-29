import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PositionResponseDto } from './dto/response/position.response.dto';
import { plainToInstance } from 'class-transformer';
import { PositionQueryRequestDto } from './dto/request/location.query.request.dto';

@ApiTags('position')
@Controller('positions')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  @ApiOperation({
    summary: '포지션 항목 조회',
    description: '쿼리 사용시 해당 포지션 데이터만 조회, 미사용시 전체 조회',
  })
  @ApiResponse({
    status: 200,
    description: '포지션 항목을 조회 하였습니다.',
    type: PositionResponseDto,
  })
  async getPositions(@Query() query: PositionQueryRequestDto) {
    let result;

    if (query) {
      result = await this.positionService.findByMain(query.main);
    } else {
      result = await this.positionService.findAll();
    }

    return plainToInstance(PositionResponseDto, result);
  }
}
