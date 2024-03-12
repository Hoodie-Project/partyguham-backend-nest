import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateUserPersonalityRequestDto {
  @ApiProperty({
    example: 1,
    description: 'personality option id(pk)',
  })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  readonly personalityOptionId: number;
}
