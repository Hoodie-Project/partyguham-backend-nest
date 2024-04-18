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

  async findById(id: number) {
    const result = await this.userPersonalityRepository.findOne({ where: { id } });

    return result;
  }

  findByPersonalityOptionIds(userId: number, personalityOptionIds: number[]) {
    return this.userPersonalityRepository.find({ where: { userId, personalityOptionId: In(personalityOptionIds) } });
  }

  findByUserId(userId: number) {
    return this.userPersonalityRepository.find({ where: { userId } });
  }

  bulkInsert(userId: number, personalityOptionIds: number[]) {
    const userLocations = personalityOptionIds.map((personalityOptionId) => ({ userId, personalityOptionId }));

    const result = this.userPersonalityRepository.save(userLocations);

    return result;
  }

  async deleteById(id: number) {
    const result = await this.userPersonalityRepository.delete({ id });

    return result.affected ? true : false;
  }
}
