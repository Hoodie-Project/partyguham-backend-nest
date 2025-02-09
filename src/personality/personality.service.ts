import { Injectable, NotFoundException } from '@nestjs/common';

import { PersonalityQuestionRepository } from 'src/personality/repository/personality-question.repository';
import { PersonalityOptionRepository } from './repository/personality-option.repository';

@Injectable()
export class PersonalityService {
  constructor(
    private personalityQuestionRepository: PersonalityQuestionRepository,
    private personalityOptionRepository: PersonalityOptionRepository,
  ) {}

  async findAllPersonality() {
    const result = await this.personalityQuestionRepository.findAllWithOption();

    return result;
  }

  async findByQuestionIdWithOption(questionId: number) {
    const result = await this.personalityQuestionRepository.findByQuestionIdWithOption(questionId);

    return result;
  }

  async findOptionByIds(ids: number[]) {
    const result = await this.personalityOptionRepository.findByIds(ids);

    // 입력한 ids와 조회된 결과의 길이를 비교하여 존재하지 않는 id를 찾습니다.
    const existingIds = result.map((item) => item.id);
    const nonExistingIds = ids.filter((id) => !existingIds.includes(id));

    // 존재하지 않는 id가 있다면 해당 id들을 반환합니다.
    if (nonExistingIds.length > 0) {
      throw new NotFoundException(`${nonExistingIds}`);
    }

    return result;
  }
}
