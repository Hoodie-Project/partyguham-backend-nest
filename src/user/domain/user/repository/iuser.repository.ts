import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { User } from '../user';

export interface IUserRepository {
  findByNickname: (nickname: string) => Promise<User | null>;
  prepare: () => Promise<number>;
  createUser: (email: string, image: string, nickname: string, gender: string, birth: string) => Promise<User>;
  updateUser: (
    userId: number,
    gender: string,
    genderVisible: boolean,
    birth: string,
    birthVisible: boolean,
    portfolioTitle: string,
    portfolio: string,
    image: string,
  ) => Promise<UserEntity>;
  deleteUserById: (userId: number) => Promise<void>;
  deleteStatusUserById: (userId: number) => Promise<void>;
  softDeleteUserById: (userId: number) => Promise<void>;
}
