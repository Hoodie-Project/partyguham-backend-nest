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

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';

import { CreateBannerRequestDto } from './dto/create-banner.request.dto';
import { DeleteBannerRequestDto } from './dto/delete-banner.request.dto';
import { BannerService } from './banner.service';

@ApiTags('banner (배너)')
@Controller('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post('web')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '배너 등록' })
  @ApiResponse({
    status: 201,
    description: '배너 등록',
    schema: {
      example: {
        platform: 'web',
        title: '제목',
        image: 'images/banner/1731250751721-600287546',
        link: 'https://partyguham.com',
        status: 'active',
        createdAt: '2024-11-10T14:59:11.728Z',
        updatedAt: '2024-11-10T14:59:11.728Z',
        id: 1,
      },
    },
  })
  async createWebBanner(@Body() body: CreateBannerRequestDto, @UploadedFile() file: Express.Multer.File) {
    const { title, link, password } = body;

    if (password !== 'hoodiev') throw new BadRequestException('password error');

    const image = file ? file.path : null;
    if (!image) throw new BadRequestException('image should not be empty');

    const result = await this.bannerService.createWeb(title, image, link);
    return result;
  }

  @Post('app')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '배너 등록' })
  @ApiResponse({
    status: 201,
    description: '배너 등록',
    schema: {
      example: {
        platform: 'app',
        title: '제목',
        image: 'images/banner/1731250751721-600287546',
        link: 'https://partyguham.com',
        status: 'active',
        createdAt: '2024-11-10T14:59:11.728Z',
        updatedAt: '2024-11-10T14:59:11.728Z',
        id: 1,
      },
    },
  })
  async createAppBanner(@Body() body: CreateBannerRequestDto, @UploadedFile() file: Express.Multer.File) {
    const { title, link, password } = body;

    if (password !== 'hoodiev') throw new BadRequestException('password error');

    const image = file ? file.path : null;
    if (!image) throw new BadRequestException('image should not be empty');

    const result = await this.bannerService.createApp(title, image, link);
    return result;
  }

  @Get('web')
  @ApiOperation({ summary: '웹 배너 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '배너 조회',
    schema: {
      example: {
        total: 1,
        banner: [
          {
            status: 'active',
            createdAt: '2024-11-10T14:59:11.728Z',
            updatedAt: '2024-11-10T14:59:11.728Z',
            id: 1,
            platform: 'web',
            title: '제목',
            image: 'images/banner/1731250751721-600287546',
            link: 'https://partyguham.com',
          },
        ],
      },
    },
  })
  async getWebBanners() {
    const result = await this.bannerService.findAllWeb();
    return { total: result[1], banner: result[0] };
  }

  @Get('app')
  @ApiOperation({ summary: '앱 배너 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '배너 조회',
    schema: {
      example: {
        total: 1,
        banner: [
          {
            status: 'active',
            createdAt: '2024-11-10T14:59:11.728Z',
            updatedAt: '2024-11-10T14:59:11.728Z',
            id: 1,
            platform: 'app',
            title: '제목',
            image: 'images/banner/1731250751721-600287546',
            link: 'https://partyguham.com',
          },
        ],
      },
    },
  })
  async getAppBanners() {
    const result = await this.bannerService.findAllApp();
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
    const { password, bannerId } = body;

    if (password !== 'hoodiev') throw new BadRequestException('password error');
    const result = await this.bannerService.delete(bannerId);

    return result;
  }
}
