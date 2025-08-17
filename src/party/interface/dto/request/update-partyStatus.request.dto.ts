import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from 'src/common/entity/baseEntity';

export class UpdatePartyStatusRequestDto {
  @ApiPropertyOptional({
    enum: ['active', 'archived'],
    description: `파티 상태
    active - 진행중
    archived - 종료
    `,
  })
  @IsIn(['active', 'archived'])
  @IsString()
  @IsOptional()
  public status: StatusEnum;
}
