import { Injectable } from '@nestjs/common';

import { PersonalityQuestionRepository } from 'src/personality/repository/personality-option.repository';

@Injectable()
export class PersonalityService {
  constructor(private PersonalityQuestionRepository: PersonalityQuestionRepository) {}

  async findAll() {
    const result = await this.PersonalityQuestionRepository.findAllWithOption();

    return result;
  }
}
