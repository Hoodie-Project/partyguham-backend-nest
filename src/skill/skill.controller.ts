import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  @Get('')
  @ApiOperation({ summary: '스킬(스텍) 항목 조회' })
  @ApiResponse({
    status: 200,
    description: '스킬 항목을 조회 하였습니다.',
  })
  async getSkill(): Promise<void> {}
}
