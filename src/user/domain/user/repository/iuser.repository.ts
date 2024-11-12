import { User } from '../user';

export interface IUserRepository {
  findByNickname: (nickname: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  prepare: () => Promise<number>;
  createUser: (nickname: string, email: string, gender: string, birth: string) => Promise<User>;
  updateUser: (
    userId: number,
    gender: string,
    genderVisible: boolean,
    birth: string,
    birthVisible: boolean,
    portfolio: string,
    image: string,
  ) => Promise<void>;
  deleteUserById: (userId: number) => Promise<void>;
  softDeleteUserById: (userId: number) => Promise<void>;
}
