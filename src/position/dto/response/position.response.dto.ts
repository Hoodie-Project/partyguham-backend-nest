import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PositionResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'position ID (PK - 포지션)' })
  id: number;

  @Expose()
  @ApiProperty({ example: '기획', description: '기획, 디자인, 개발, 마케터/광고' })
  main: string;

  @Expose()
  @ApiProperty({
    example: 'UI/UX 기획자',
    description: '  UI/UX 기획자, PM (프로젝트 매니저), PO (프로덕트 오너), 서비스 기획자 ...',
  })
  sub: string;
}
