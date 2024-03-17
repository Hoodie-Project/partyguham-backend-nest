import { CareerTypeEnum, UserCareerEntity } from 'src/user/infra/db/entity/user-career.entity';
import { InsertResult } from 'typeorm';

export interface IUserCareerRepository {
  findByUserId: (userId: number) => Promise<UserCareerEntity[]>;
  createCareer: (userId: number, positionId: number, careerType: CareerTypeEnum) => Promise<UserCareerEntity>;
  bulkInsert: (userId: number, positionIds: number[], careerTypes: CareerTypeEnum[]) => Promise<InsertResult>;
}
