import { CareerTypeEnum, UserCareerEntity } from 'src/user/infra/db/entity/user-career.entity';
import { CareerDto } from 'src/user/interface/dto/career.dto';

import { InsertResult } from 'typeorm';

export interface IUserCareerRepository {
  findById: (id: number) => Promise<UserCareerEntity>;
  findByUserId: (userId: number) => Promise<UserCareerEntity[]>;
  findByUserIdAndCareerType: (userId: number, careerType: CareerTypeEnum) => Promise<UserCareerEntity[]>;
  create: (userId: number, positionId: number, year: number, careerType: CareerTypeEnum) => Promise<UserCareerEntity>;
  bulkInsert: (userId: number, career: CareerDto[]) => Promise<InsertResult>;
  deleteById: (id: number) => Promise<boolean>;
}
