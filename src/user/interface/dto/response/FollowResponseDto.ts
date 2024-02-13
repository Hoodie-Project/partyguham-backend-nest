import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FollowCountsResponseDto {
  @Expose()
  @ApiProperty()
  followerCount: number;

  @Expose()
  @ApiProperty()
  followingCount: number;
}

@Exclude()
export class FollowUserResponseDto {
  @Expose()
  @ApiProperty({
    example: '닉네임넣는자리',
  })
  nickname: number;

  @Expose()
  @ApiProperty({
    example: 'image url',
  })
  image: string;
}

export class FollowResponseDto {
  @ApiProperty()
  counts: FollowCountsResponseDto;

  @ApiProperty()
  users: FollowUserResponseDto;
}
