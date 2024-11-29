import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { GetPartiesResponseDto } from './get-parties.response.dto';
import { GetPartyRecruitmentsResponseDto } from './recruitment/get-partyRecruitments.response.dto';

export class GetSearchResponseDto {
  @Expose()
  @Type(() => GetPartiesResponseDto)
  @ApiProperty({ description: '파티 데이터 목록', type: GetPartiesResponseDto })
  @IsNotEmpty()
  party: GetPartiesResponseDto; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.

  @Expose()
  @Type(() => GetPartyRecruitmentsResponseDto)
  @ApiProperty({ description: '모집 공고 데이터 목록', type: GetPartyRecruitmentsResponseDto })
  @IsNotEmpty()
  partyRecruitment: GetPartyRecruitmentsResponseDto;
}
