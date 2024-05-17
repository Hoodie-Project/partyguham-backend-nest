import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserPersonalityCommand } from './create.userPersonality.command';
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
    const surveyPersonality = await this.personalityService.findAllPersonality();

    // 저장할 optionId
    let userPersonalityOptionIds = [];

    // 유저가 응답(저장) 되어있는 값 찾기
    const savedUserPersonality = await this.userPersonalityRepository.findByUserId(userId);
    const savedUserPersonalityOptionIds = savedUserPersonality.map((userPersonality) => {
      return userPersonality.personalityOptionId;
    });

    // 유저 응답별에 대해 validation 실행
    personality.forEach((userAnswer) => {
      // 설문조사 질문, 선택지
      const surveyQuestion = surveyPersonality.find((question) => question.id === userAnswer.personalityQuestionId);
      const surveyOptionIds = surveyQuestion.personalityOption.map((option) => option.id);

      // 이미 설문을 한 항목에 대해 취소
      const duplicated = savedUserPersonalityOptionIds.some((saveOptionId) => surveyOptionIds.includes(saveOptionId));

      if (duplicated) {
        throw new ConflictException(`이미 설문조사를 한 항목이 있습니다.`);
      }

      // 다중 선택 체크
      if (surveyQuestion.responseCount < userAnswer.personalityOptionId.length) {
        throw new ConflictException(`질문에 대한 응답 개수 조건이 맞지 않는 항목이 있습니다.`);
      }

      // optionId 유효 확인
      userAnswer.personalityOptionId.map((userAnswerPersonalityOptionId) => {
        const validation = surveyOptionIds.includes(userAnswerPersonalityOptionId);

        if (validation) {
          userPersonalityOptionIds.push(userAnswerPersonalityOptionId);
        } else {
          throw new ConflictException(`질문에 맞지 않는 선택지가 있습니다.`);
        }
      });
    });

    // 저장
    const result = await this.userPersonalityRepository.bulkInsert(userId, userPersonalityOptionIds);

    return result;
  }
}
