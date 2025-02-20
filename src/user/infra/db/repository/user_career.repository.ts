import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserCareerRepository } from 'src/user/domain/user/repository/iuserCareer.repository';
import { CareerTypeEnum, UserCareerEntity } from '../entity/user_career.entity';
import { CareerDto } from 'src/user/interface/dto/career.dto';
import { UpdateCareerDto } from 'src/user/interface/dto/request/update-userCareer.request.dto';

@Injectable()
export class UserCareerRepository implements IUserCareerRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserCareerEntity)
    private userCareerRepository: Repository<UserCareerEntity>,
  ) {}

  async findById(id: number) {
    const result = await this.userCareerRepository.findOne({ where: { id } });

    return result;
  }

  async findByUserId(userId: number) {
    const result = await this.userCareerRepository.find({ where: { userId } });

    return result;
  }

  async findByUserIdAndCareerType(userId: number, careerType: CareerTypeEnum) {
    const result = await this.userCareerRepository.find({ where: { userId, careerType } });

    return result;
  }

  async findByUserIdAndPrimary(userId: number) {
    const result = await this.userCareerRepository.findOne({ where: { userId, careerType: CareerTypeEnum.PRIMARY } });

    return result;
  }

  async create(userId: number, positionId: number, years: number, careerType: CareerTypeEnum) {
    const result = await this.userCareerRepository.save({ userId, positionId, years, careerType });

    return result;
  }

  async bulkInsert(userId: number, career: CareerDto[]) {
    const userLocations = career.map((value) => ({
      userId,
      ...value,
    }));

    const result = await this.userCareerRepository.insert(userLocations);
    return result;
  }

  async updateCareers(updateCareer: UpdateCareerDto[]) {
    return await this.userCareerRepository.save(updateCareer);
  }

  async deleteById(id: number) {
    const result = await this.userCareerRepository.delete({ id });

    return result.affected ? true : false;
  }

  async deleteByUserId(userId: number) {
    const result = await this.userCareerRepository.delete({ userId });

    return result.affected ? true : false;
  }
}
