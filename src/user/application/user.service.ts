import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserCareerRepository } from '../infra/db/repository/user_career.repository';
import { UserLocationRepository } from '../infra/db/repository/user_location.repository';
import { UserPersonalityRepository } from '../infra/db/repository/user_personality.repository';
import { UserRepository } from '../infra/db/repository/user.repository';
import { StatusEnum } from 'src/common/entity/baseEntity';
import { USER_ERROR } from 'src/common/error/user-error.message';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    @Inject('UserCareerRepository') private userCareerRepository: UserCareerRepository,
    @Inject('UserLocationRepository') private userLocationRepository: UserLocationRepository,
    @Inject('UserPersonalityRepository') private userPersonalityRepository: UserPersonalityRepository,
  ) {}

  async validateLogin(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (user.status === StatusEnum.INACTIVE) {
      throw new ForbiddenException(USER_ERROR.USER_DELETED_30D);
    }

    if (user.status !== StatusEnum.ACTIVE) {
      throw new ForbiddenException(USER_ERROR.USER_FORBIDDEN_DISABLED);
    }
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
}
