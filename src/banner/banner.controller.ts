import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBannerRequestDto } from './dto/create-banner.request.dto';
import { plainToInstance } from 'class-transformer';
import { DeleteBannerRequestDto } from './dto/delete-banner.request.dto';

@ApiTags('banner (배너)')
@Controller('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '배너 등록' })
  @ApiResponse({
    status: 201,
    description: '배너 등록',
  })
  async createBanner(@Body() body: CreateBannerRequestDto, @UploadedFile() file: Express.Multer.File) {
    const { title, password } = body;

    if (password !== 'hoodiev') throw new BadRequestException('password error');

    const image = file ? file.path : null;
    if (image) throw new BadRequestException('image should not be empty');

    const result = await this.bannerService.create(title, image);
    return result;
  }

  @Get('')
  @ApiOperation({ summary: '배너 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '배너 조회',
    schema: { example: { total: 1, banner: [{ id: 1, image: '/image/banner' }] } },
  })
  async getBanners() {
    const result = await this.bannerService.findAll();
    return { total: result[1], banner: result[0] };
  }

  @Delete('')
  @HttpCode(204)
  @ApiOperation({ summary: '배너 삭제' })
  @ApiResponse({
    status: 204,
    description: '배너 삭제',
  })
  async createReport(@Body() body: DeleteBannerRequestDto) {
    const result = await this.bannerService.delete(body.bannerId);
    return result;
  }
}
