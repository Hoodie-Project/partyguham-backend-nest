import { ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserCareerRepository } from '../infra/db/repository/user_career.repository';
import { UserLocationRepository } from '../infra/db/repository/user_location.repository';
import { UserPersonalityRepository } from '../infra/db/repository/user_personality.repository';
import { UserRepository } from '../infra/db/repository/user.repository';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { USER_ERROR } from 'src/common/error/user-error.message';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    @Inject('UserCareerRepository') private userCareerRepository: UserCareerRepository,
    @Inject('UserLocationRepository') private userLocationRepository: UserLocationRepository,
    @Inject('UserPersonalityRepository') private userPersonalityRepository: UserPersonalityRepository,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  async validateLogin(userId: number, oauthId: number) {
    const user = await this.userRepository.findById(userId);

    if (user.status === StatusEnum.INACTIVE) {
      const recoverAccessToken = await this.authService.createRecoverToken(oauthId);
      throw new ForbiddenException({
        ...USER_ERROR.USER_DELETED_30D,
        recoverAccessToken,
        email: user.email,
        deletedAt: user.updatedAt,
      });
    }

    if (user.status !== StatusEnum.ACTIVE) {
      throw new ForbiddenException(USER_ERROR.USER_FORBIDDEN_DISABLED);
    }
  }

  async findUserById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async findUserCarerrPrimaryByUserId(userId: number) {
    const userCarerr = await this.userCareerRepository.findByUserIdAndPrimary(userId);

    return userCarerr;
  }

  async findUserLocationByUserId(userId: number) {
    const userCarerr = await this.userLocationRepository.findByUserId(userId);

    return userCarerr;
  }

  async findUserPersonalityByUserId(userId: number) {
    const userCarerr = await this.userPersonalityRepository.findByUserId(userId);

    return userCarerr;
  }

  async createAppOpenNotifications(userId: number) {
    const user = await this.findUserById(userId);
    const email = user.email;

    const existing = await this.notificationService.findByEmail(email);

    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다.', 'CONFLICT');
    }

    return await this.notificationService.saveEmail(email);
  }
}
