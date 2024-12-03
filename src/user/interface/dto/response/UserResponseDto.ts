import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'user ID (PK - 유저)',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'partyguam@hoodiev.com',
    description: '이메일',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: '후디브',
    description: '닉네임',
  })
  nickname: string;

  @Expose()
  @ApiProperty({
    example: '1995-03-21',
    description: '생년월일',
  })
  birth: string;

  @Expose()
  @ApiProperty({
    example: true,
    description: '생일 공개 여부',
  })
  birthVisible: boolean;

  @Expose()
  @ApiProperty({
    example: 'M',
    description: '성별(M / F)',
  })
  gender: string;

  @Expose()
  @ApiProperty({
    example: true,
    description: '성별 공개 여부',
  })
  genderVisible: boolean;

  @Expose()
  @ApiProperty({
    example: '/image/..',
    description: '이미지 경로',
  })
  image: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-03T03:21:21.943Z',
    description: '유저 생성일',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: [
      {
        question: '집중이 잘 되는 시간은 언제인가요?',
        options: ['아침 (6시~12시)', '점심 (12시~18시)'],
      },
      {
        question: '가장 가깝다고 생각하는 성향은 무엇인가요?',
        options: ['계획에 따른 체계적인 실행이 중요해요', '세워진 계획에 따르지만 유연한 실행이 중요해요'],
      },
      {
        question: '아래 항목 중 자신 있는 것은 무엇인가요?',
        options: ['해당 분야의 기술적인 역량과 전문 지식을 보유하고 있어요', '효율적으로 일을 처리할 수 있어요'],
      },
    ],
    description: '유저 설문 (성향 질문)',
  })
  userPersonalities: object[];

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 2,
        years: 1,
        careerType: 'primary',
        position: {
          main: '기획자',
          sub: 'UI/UX 기획자',
        },
      },
    ],
    description: '주포지션/부포지션 - 유저 커리어',
  })
  userCareers: object[];

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        location: {
          province: '서울',
          city: '전체',
        },
      },
    ],
    description: '유저 선호 장소',
  })
  userLocations: object[];
}
