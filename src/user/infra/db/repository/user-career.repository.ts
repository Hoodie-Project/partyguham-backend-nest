import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';
import { CareerTypeEnum, UserCareerEntity } from '../entity/user-career.entity';

@Injectable()
export class UserCareerRepository implements IUserCareerRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserCareerEntity)
    private userLocationRepository: Repository<UserCareerEntity>,
  ) {}

  async findByUserId(userId: number) {
    const result = await this.userLocationRepository.find({ where: { userId } });

    return result;
  }

  async createCareer(userId: number, positionId: number, careerType: CareerTypeEnum) {
    const result = await this.userLocationRepository.save({ userId, positionId, careerType });

    return result;
  }

  async bulkInsert(userId: number, positionIds: number[], careerTypes: CareerTypeEnum[]) {
    const userLocations = positionIds.map((positionId, index) => ({
      userId,
      positionId,
      careerType: careerTypes[index], // 해당 인덱스의 careerTypes 요소 참조
    }));

    const result = await this.userLocationRepository.insert(userLocations);
    return result;
  }
}
