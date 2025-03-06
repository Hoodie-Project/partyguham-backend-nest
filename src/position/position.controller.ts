import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { PositionResponseDto } from './dto/response/position.response.dto';
import { plainToInstance } from 'class-transformer';
import { PositionQueryRequestDto } from './dto/request/location.query.request.dto';

@ApiTags('position - 포지션 (직군/직무)')
@Controller('positions')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Get('description')
  @ApiOperation({
    summary: '이 엔드포인트는 실제로 구현되지 않고, Swagger 문서화를 위해 사용됩니다.',
    description: `포지션(직군/직무)에 해당하는 API 입니다.
    
    main - 직군(기획자/디자이너/개발자)
    sub - 직무(PM/웹디자이너/프론트엔드)
    `,
  })
  getLocationOverview() {
    // 이 엔드포인트는 실제로 구현되지 않고, Swagger 문서화를 위해 사용됩니다.
  }

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
