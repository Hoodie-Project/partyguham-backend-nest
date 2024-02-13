import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  account: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  nickname: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  isParty: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}

@Exclude()
export class UsersResponseDto {
  @Expose()
  @ApiProperty()
  data: UserResponseDto[]; // UserResponseData는 UserResponseDto의 데이터 형태를 정의하는 클래스입니다.

  @Expose()
  @ApiProperty()
  count: number;
}
