import { UserEntity } from 'src/user/infra/db/entity/user.entity';

export interface IUserRepository {
  findById: (id: number) => Promise<UserEntity>;
  findByIdWithoutDeleted: (id: number) => Promise<UserEntity>;
  findByNickname: (nickname: string) => Promise<UserEntity | null>;
  prepare: () => Promise<number>;
  createUser: (email: string, image: string, nickname: string, gender: string, birth: string) => Promise<UserEntity>;
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
  setUserActiveById: (userId: number) => Promise<void>;
  setUserInactiveById: (userId: number) => Promise<void>;
  softDeleteUserById: (userId: number) => Promise<void>;
}
