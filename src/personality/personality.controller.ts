import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonalityService } from './personality.service';
import { personalityQuestionsResponseDto } from './dto/response/personality.response.dto';

@ApiTags('personality')
@Controller('personality')
export class PersonalityController {
  constructor(private personalityService: PersonalityService) {}
  @Get('')
  @ApiOperation({ summary: '성향 질문/선택지 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '성향 질문/선택지 리스트 조회 하였습니다.',
    type: personalityQuestionsResponseDto,
  })
  async getPersonality() {
    const result = await this.personalityService.findAllPersonality();

    return result;
  }
}
