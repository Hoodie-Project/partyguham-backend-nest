import { User } from '../user';

export interface IUserRepository {
  findByNickname: (nickname: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  prepare: () => Promise<number>;
  createUser: (nickname: string, email: string, gender: string, birth: string) => Promise<User>;
  updateUser: (id: number, gender: string, birth: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  softDeleteUser: (id: number) => Promise<void>;
}
