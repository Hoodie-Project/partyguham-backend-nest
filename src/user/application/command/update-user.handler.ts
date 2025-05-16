import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { UpdateUserCommand } from './update-user.command';
import { ImageService } from 'src/libs/image/image.service';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    private imageService: ImageService,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { userId, gender, genderVisible, birth, birthVisible, portfolioTitle, portfolio, imagePath } = command;
    const savedImagePath = imagePath ? this.imageService.getRelativePath(imagePath) : undefined;

    const user = await this.userRepository.findByIdWithoutDeleted(userId);

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    const updateUser = await this.userRepository.updateUser(
      userId,
      gender,
      genderVisible,
      birth,
      birthVisible,
      portfolioTitle,
      portfolio,
      savedImagePath,
    );

    this.imageService.deleteImage(user.image);

    return updateUser;
  }
}
