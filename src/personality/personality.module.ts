import { Module } from '@nestjs/common';
import { PersonalityController } from './personality.controller';
import { PersonalityService } from './personality.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalityOptionEntity } from './entity/personality-option.entity';
import { PersonalityQuestionEntity } from './entity/personality-question.entity';
import { PersonalityQuestionRepository } from './repository/personality-question.repository';

@Module({
  controllers: [PersonalityController],
  providers: [PersonalityService, PersonalityQuestionRepository],
  imports: [TypeOrmModule.forFeature([PersonalityOptionEntity, PersonalityQuestionEntity])],
})
export class PersonalityModule {}
