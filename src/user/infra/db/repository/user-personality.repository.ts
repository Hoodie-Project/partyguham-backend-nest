import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserPersonalityRepository } from 'src/user/domain/user/repository/iuserPersonality.repository';
import { UserPersonalityEntity } from '../entity/user-personality.entity';

@Injectable()
export class UserPersonalityRepository implements IUserPersonalityRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserPersonalityEntity)
    private userPersonalityRepository: Repository<UserPersonalityEntity>,
  ) {}

  findByPersonalityOptionIds(userId: number, personalityOptionIds: number[]) {
    return this.userPersonalityRepository.find({ where: { userId, personalityOptionId: In(personalityOptionIds) } });
  }

  findByUserId(userId: number) {
    return this.userPersonalityRepository.find({ where: { userId } });
  }

  bulkInsert(userId: number, optionIds: number[]) {
    const userLocations = optionIds.map((locationId) => ({ userId, locationId }));

    const result = this.userPersonalityRepository.save(userLocations);

    return result;
  }
}
