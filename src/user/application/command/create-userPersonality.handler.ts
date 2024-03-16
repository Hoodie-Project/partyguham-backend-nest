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
    const surveyPersonality = await this.personalityService.findAllPersonality();

    // 저장할 optionId
    let userPersonalityOptionIds = [];

    // 저장 되어있는 값 찾기
    const savedUserPersonality = await this.userPersonalityRepository.findByUserId(userId);
    const saveUserPersonalityOptionIds = savedUserPersonality.map((userPersonality) => {
      return userPersonality.personalityOptionId;
    });

    // 유저 응답에 대한 validation 실행
    personality.forEach(async (answer) => {
      const surveyQuestion = surveyPersonality.find((question) => question.id === answer.questionId);
      const surveyOption = surveyPersonality[answer.questionId].personalityOption.map((option) => option.id);

      // 이미 설문을 한 항목에 대해 취소
      const duplicated = saveUserPersonalityOptionIds.some((saveOptionId) => surveyOption.includes(saveOptionId));
      if (duplicated) {
        throw new BadRequestException(`이미 설문조사를 한 항목입니다. { id : ${answer.questionId}`);
      }

      // 다중 선택 체크
      if (surveyQuestion.multiple === false && answer.optionId.length > 1) {
        throw new BadRequestException(`중복 선택이 되지 않습니다. { questionId : ${answer.questionId} }`);
      }

      if (surveyQuestion.multiple === true && answer.optionId.length > 2) {
        throw new BadRequestException(`중복 선택이 2개이상 되지 않습니다. { questionId : ${answer.questionId} }`);
      }

      // optionId 유효 확인
      answer.optionId.map((optionId) => {
        const result = surveyOption.includes(optionId);

        if (result) {
          userPersonalityOptionIds.push(optionId);
        } else {
          throw new BadRequestException(`유효하지 않는 선택지 입니다.: { optionId : ${optionId} }`);
        }
      });
    });

    // 저장 로직 필요
    const result = await this.userPersonalityRepository.bulkInsert(userId, userPersonalityOptionIds);

    return result;
  }
}
