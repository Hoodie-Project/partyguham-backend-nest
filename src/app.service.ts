import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  notFound(): string {
    throw new NotFoundException();
  }
}
