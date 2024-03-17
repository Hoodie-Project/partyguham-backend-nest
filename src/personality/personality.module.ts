import { Module } from '@nestjs/common';
import { PersonalityController } from './personality.controller';
import { PersonalityService } from './personality.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalityOptionEntity } from './entity/personality-option.entity';
import { PersonalityQuestionEntity } from './entity/personality-question.entity';
import { PersonalityQuestionRepository } from './repository/personality-question.repository';
import { PersonalityOptionRepository } from './repository/personality-option.repository';

@Module({
  controllers: [PersonalityController],
  providers: [PersonalityService, PersonalityQuestionRepository, PersonalityOptionRepository],
  imports: [TypeOrmModule.forFeature([PersonalityOptionEntity, PersonalityQuestionEntity])],
  exports: [PersonalityService],
})
export class PersonalityModule {}
