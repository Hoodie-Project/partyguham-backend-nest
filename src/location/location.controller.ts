import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { locationResponseDto } from './dto/response/location.response.dto';
import { plainToInstance } from 'class-transformer';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { LocationQueryRequestDto } from './dto/request/location.query.request.dto';

@ApiTags('location - 지역/장소')
@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('description')
  @ApiOperation({
    summary: '이 엔드포인트는 실제로 구현되지 않고, Swagger 문서화를 위해 사용됩니다.',
    description: `지역에 해당하는 API 입니다.
    
    province - 시/도
    city - 시/군/구/동/읍/면/리
    `,
  })
  getLocationOverview() {
    // 이 엔드포인트는 실제로 구현되지 않고, Swagger 문서화를 위해 사용됩니다.
  }

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: '장소 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '장소 리스트 조회',
    type: locationResponseDto,
  })
  async getLocations(@Query() query: LocationQueryRequestDto) {
    let result;

    if (query) {
      result = await this.locationService.findByProvince(query.province);
    } else {
      result = await this.locationService.findAll();
    }

    return plainToInstance(locationResponseDto, result);
  }
}
