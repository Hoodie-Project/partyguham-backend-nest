import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { locationResponseDto } from './dto/response/location.response.dto';
import { plainToInstance } from 'class-transformer';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

@ApiTags('location')
@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: '장소 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '장소 리스트 조회',
    type: locationResponseDto,
  })
  async getLocations() {
    const result = await this.locationService.findAll();

    return plainToInstance(locationResponseDto, result);
  }
}
