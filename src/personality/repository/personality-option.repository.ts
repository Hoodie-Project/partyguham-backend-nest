import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalityQuestionEntity } from '../entity/personality_question.entity';
import { PersonalityOptionEntity } from '../entity/personality_option.entity';

@Injectable()
export class PersonalityOptionRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PersonalityOptionEntity)
    private positionOptionRepository: Repository<PersonalityOptionEntity>,
  ) {}

  findByIds(ids: number[]) {
    return this.positionOptionRepository.find({ where: { id: In(ids) } });
  }
}
