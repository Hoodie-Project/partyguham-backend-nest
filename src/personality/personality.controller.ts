import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('personality')
@Controller('personality')
export class PersonalityController {
  @Get('')
  @ApiOperation({ summary: '성향 질문/선택지 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '성향 질문/선택지 리스트 조회 하였습니다.',
  })
  async getPersonality(): Promise<void> {}
}
