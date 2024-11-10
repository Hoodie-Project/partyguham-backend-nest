import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteBannerRequestDto {
  @ApiProperty({
    example: 1,
    description: 'banner ID (PK - 배너)',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly bannerId: number;
}
