import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
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
    description: '포트폴리오 제목',
    example: '포트폴리오 제목',
  })
  public portfolioTitle: string;

  @Expose()
  @ApiProperty({
    description: '포트폴리오 링크',
    example: 'https://example.com/..',
    anyOf: [{ type: 'string' }, { type: 'null' }],
  })
  public portfolio: string;

  @Expose()
  @ApiProperty({
    example: '/image/..',
    description: '이미지 경로',
    anyOf: [{ type: 'string' }, { type: 'null' }],
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
    example: '2024-06-07T03:21:21.943Z',
    description: '유저 수정일',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        personalityOption: {
          id: 1,
          content: '아침 (6시~12시)',
          personalityQuestion: {
            id: 1,
            content: '집중이 잘 되는 시간은 언제인가요?',
            responseCount: 2,
          },
        },
      },
      {
        id: 7,
        personalityOption: {
          id: 2,
          content: '점심 (12시~18시)',
          personalityQuestion: {
            id: 1,
            content: '집중이 잘 되는 시간은 언제인가요?',
            responseCount: 2,
          },
        },
      },
      {
        id: 8,
        personalityOption: {
          id: 6,
          content: '계획에 따른 체계적인 실행이 중요해요',
          personalityQuestion: {
            id: 2,
            content: '가장 가깝다고 생각하는 성향은 무엇인가요?',
            responseCount: 1,
          },
        },
      },
      {
        id: 9,
        personalityOption: {
          id: 7,
          content: '세워진 계획에 따르지만 유연한 실행이 중요해요',
          personalityQuestion: {
            id: 2,
            content: '가장 가깝다고 생각하는 성향은 무엇인가요?',
            responseCount: 1,
          },
        },
      },
      {
        id: 10,
        personalityOption: {
          id: 8,
          content: '해당 분야의 기술적인 역량과 전문 지식을 보유하고 있어요',
          personalityQuestion: {
            id: 3,
            content: '아래 항목 중 자신 있는 것은 무엇인가요?',
            responseCount: 2,
          },
        },
      },
      {
        id: 11,
        personalityOption: {
          id: 9,
          content: '효율적으로 일을 처리할 수 있어요',
          personalityQuestion: {
            id: 3,
            content: '아래 항목 중 자신 있는 것은 무엇인가요?',
            responseCount: 2,
          },
        },
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
          id: 1,
          province: '서울',
          city: '전체',
        },
      },
      {
        id: 36,
        location: {
          id: 3,
          province: '서울',
          city: '강동구',
        },
      },
    ],
    description: '유저 선호 장소',
  })
  userLocations: object[];
}
