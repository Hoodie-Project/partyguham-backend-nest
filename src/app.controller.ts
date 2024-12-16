import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  notFound(): string {
    return this.appService.notFound();
  }

  @Get('error')
  error(): string {
    throw new InternalServerErrorException('error test');
  }
}
