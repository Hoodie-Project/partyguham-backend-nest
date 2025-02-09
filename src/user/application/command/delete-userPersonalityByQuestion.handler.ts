import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserPersonalityRepository } from 'src/user/domain/user/repository/iuserPersonality.repository';
import { DeleteUserPersonalityByQuestionCommand } from './delete-userPersonalityByQuestion.command';
import { PersonalityService } from 'src/personality/personality.service';

@Injectable()
@CommandHandler(DeleteUserPersonalityByQuestionCommand)
export class DeleteUserPersonalityByQuestionHandler implements ICommandHandler<DeleteUserPersonalityByQuestionCommand> {
  constructor(
    @Inject('UserPersonalityRepository') private userPersonalityRepository: IUserPersonalityRepository,
    private readonly personalityService: PersonalityService,
  ) {}

  async execute(command: DeleteUserPersonalityByQuestionCommand) {
    const { userId, personalityQuestionId } = command;
    const question = await this.personalityService.findByQuestionIdWithOption(personalityQuestionId);

    const personalityOptionIds = question.personalityOptions.map((option) => option.id);

    const savedUserPersonality = await this.userPersonalityRepository.findByPersonalityOptionIds(
      userId,
      personalityOptionIds,
    );

    if (savedUserPersonality.length === 0) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    const result = await this.userPersonalityRepository.deleteByPersonalityOptionIds(userId, personalityOptionIds);

    if (!result) {
      throw new InternalServerErrorException('삭제 실패');
    }

    return result;
  }
}
