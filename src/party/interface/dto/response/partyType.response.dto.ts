import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class PartyTypeResponseDto {
  @Expose()
  @ApiProperty({
    example: '2',
    description: 'Party Type ID (파티타입 고유 번호)',
  })
  @IsString()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '스터디',
    description: '파티 타입 요소',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;
}

// export class PartyTypesResponseDto {
//   @Expose()
//   @ApiProperty({ type: [PartyTypeResponseDto] })
//   @Type(() => PartyTypeResponseDto)
//   partyTypes: PartyTypeResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.

//   @Expose()
//   @ApiProperty({
//     example: 1,
//   })
//   total: number;
// }
