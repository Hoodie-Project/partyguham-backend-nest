import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonalityService } from './personality.service';
import { personalityQuestionResponseDto } from './dto/response/personality.response.dto';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

@ApiTags('personality')
@Controller('personalities')
export class PersonalityController {
  constructor(private personalityService: PersonalityService) {}

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: '성향 질문/선택지 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '성향 질문/선택지 리스트 조회 하였습니다.',
    type: [personalityQuestionResponseDto],
  })
  async getPersonality() {
    const result = await this.personalityService.findAllPersonality();

    return result;
  }
}
