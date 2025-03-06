import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { plainToInstance } from 'class-transformer';
import { ReportRequestDto } from './dto/request/report.request.dto';
import { ReportResponseDto } from './dto/response/report.response.dto';

@ApiTags('report - 신고')
@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Post('')
  @ApiOperation({ summary: '신고하기' })
  @ApiResponse({
    status: 201,
    description: '신고 완료 하였습니다.',
    type: ReportResponseDto,
  })
  async createReport(@Body() body: ReportRequestDto) {
    const { type, typeId, content } = body;
    const result = await this.reportService.create(type, typeId, content);

    return plainToInstance(ReportResponseDto, result);
  }
}
