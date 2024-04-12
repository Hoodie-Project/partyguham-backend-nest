import { CareerTypeEnum, UserCareerEntity } from 'src/user/infra/db/entity/user-career.entity';
import { InsertResult } from 'typeorm';

export interface IUserCareerRepository {
  findById: (id: number) => Promise<UserCareerEntity>;
  findByUserId: (userId: number) => Promise<UserCareerEntity[]>;
  findByUserIdAndCareerType: (userId: number, careerType: CareerTypeEnum) => Promise<UserCareerEntity[]>;
  createCareer: (
    userId: number,
    positionId: number,
    year: number,
    careerType: CareerTypeEnum,
  ) => Promise<UserCareerEntity>;
  bulkInsert: (
    userId: number,
    positionIds: number[],
    year: number[],
    careerTypes: CareerTypeEnum[],
  ) => Promise<InsertResult>;
  deleteById: (id: number) => Promise<boolean>;
}
