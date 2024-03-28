import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { locationResponseDto, locationsResponseDto } from './dto/response/location.response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('location')
@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('')
  @ApiOperation({ summary: '장소 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '장소 리스트 조회',
    type: locationsResponseDto,
  })
  async getLocations() {
    const result = await this.locationService.findAll();

    return plainToInstance(locationResponseDto, result);
  }
}
