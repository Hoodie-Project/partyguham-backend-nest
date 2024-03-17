import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
    private authService: AuthService,
  ) {}

  async execute(command: CreateUserCommand) {
    const { account, nickname, email } = command;

    const verify = await this.userRepository.findByNickname(account);
    if (verify !== null) {
      throw new ConflictException('유저가 이미 존재 합니다.');
    }

    const user = await this.userRepository.create(account, nickname, email);
    const userId = user.id;
    const encryptUserId = await this.authService.encrypt(String(userId));

    const accessToken = await this.authService.createAccessToken(encryptUserId);
    const refreshToken = await this.authService.createRefreshToken(encryptUserId);
    this.authService.saveRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }
}
