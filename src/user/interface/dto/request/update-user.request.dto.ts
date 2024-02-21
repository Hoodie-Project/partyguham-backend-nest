import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { OnlineStatus } from 'src/user/infra/db/entity/user.entity';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({
    example: true,
    description: '온라인: true / 오프라인 false',
  })
  @IsBoolean()
  @IsOptional()
  readonly onlineStatus: OnlineStatus;

  @ApiPropertyOptional({
    example: 1,
    description: 'position id(pk)',
  })
  @IsInt()
  @IsOptional()
  readonly positionId: number[];
}
