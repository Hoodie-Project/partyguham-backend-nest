import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalityQuestionEntity } from '../entity/personality_question.entity';

@Injectable()
export class PersonalityQuestionRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PersonalityQuestionEntity)
    private positionQuestionRepository: Repository<PersonalityQuestionEntity>,
  ) {}

  findAllWithOption() {
    return this.positionQuestionRepository.find({ relations: ['personalityOptions'] });
  }

  findByQuestionIdWithOption(questionId: number) {
    return this.positionQuestionRepository.findOne({ where: { id: questionId }, relations: ['personalityOptions'] });
  }
}
