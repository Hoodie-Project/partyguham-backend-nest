import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserPersonalityCommand } from './create-userPersonality.command';
import { IUserPersonalityRepository } from 'src/user/domain/user/repository/iuserPersonality.repository';
import { PersonalityService } from 'src/personality/personality.service';

@Injectable()
@CommandHandler(CreateUserPersonalityCommand)
export class CreateUserPersonalityHandler implements ICommandHandler<CreateUserPersonalityCommand> {
  constructor(
    @Inject('UserPersonalityRepository') private userPersonalityRepository: IUserPersonalityRepository,
    private readonly personalityService: PersonalityService,
  ) {}

  async execute(command: CreateUserPersonalityCommand) {
    let { userId, personality } = command;
    const survey = await this.personalityService.findAllPersonality();

    let personalityOptionIds = [];

    // 다중 선택 검사
    personality.forEach((answer) => {
      const question = survey.find((survey) => survey.id === answer.questionId);

      if (question.multiple === false && answer.optionId.length > 1) {
        throw new BadRequestException(`{questionId : ${answer.questionId}} multiple error`);
      }
      // optionId 유효 확인

      personalityOptionIds.concat(answer.optionId);
    });

    // 중복 검사
    this.userPersonalityRepository.findByPersonalityOptionIds(userId, personalityOptionIds);

    // 중복 제외 저장
  }
}
