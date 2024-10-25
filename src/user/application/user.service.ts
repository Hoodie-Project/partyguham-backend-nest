import { Inject, Injectable } from '@nestjs/common';
import { UserCareerRepository } from '../infra/db/repository/user_career.repository';
import { UserLocationRepository } from '../infra/db/repository/user_location.repository';
import { UserPersonalityRepository } from '../infra/db/repository/user_personality.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserCareerRepository') readonly userCareerRepository: UserCareerRepository,
    @Inject('UserLocationRepository') readonly userLocationRepository: UserLocationRepository,
    @Inject('UserPersonalityRepository') readonly userPersonalityRepository: UserPersonalityRepository,
  ) {}

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
