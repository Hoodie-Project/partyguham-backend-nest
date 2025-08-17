import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { UpdateUserCommand } from './update-user.command';
import { ImageService } from 'src/libs/image/image.service';
import { S3Service } from 'src/libs/aws/s3/s3.service';
import { userImageKey } from 'src/libs/aws/s3/key.util';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private s3Service: S3Service,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { userId, gender, genderVisible, birth, birthVisible, portfolioTitle, portfolio, image } = command;

    const user = await this.userRepository.findByIdWithoutDeleted(userId);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    let key: string | undefined;

    if (image) {
      key = userImageKey(userId, image.originalname);
      await this.s3Service.uploadFile(image, key);
    }

    const updatedUser = await this.userRepository.updateUser(
      userId,
      gender,
      genderVisible,
      birth,
      birthVisible,
      portfolioTitle,
      portfolio,
      key ?? user.image, // 기존 이미지 유지
    );

    // ✅ 업데이트 성공 후 기존 이미지 삭제
    if (image && user.image) {
      await this.s3Service.deleteFile(user.image);
    }

    return updatedUser;
  }
}
