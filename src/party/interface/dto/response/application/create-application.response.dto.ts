import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreatePartyApplicationResponseDto {
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'party application ID (PK - 파티 지원자)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '지원합니다~',
    description: '지원자 응답 메세지',
  })
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: `지원자 상태  
    
    검토중 - active
    수락 - approved
    응답대기 - pending
    거절 - rejected`,
  })
  @IsNotEmpty()
  readonly status: object;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '지원일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;
}
