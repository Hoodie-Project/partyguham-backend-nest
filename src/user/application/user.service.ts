import { Inject, Injectable } from '@nestjs/common';
import { UserCareerRepository } from '../infra/db/repository/user_career.repository';

@Injectable()
export class UserService {
  constructor(@Inject('UserCareerRepository') readonly userCareerRepository: UserCareerRepository) {}

  async findByUserIdAndPrimary(userId: number) {
    const userCarerr = await this.userCareerRepository.findByUserIdAndPrimary(userId);

    return userCarerr;
  }
}
