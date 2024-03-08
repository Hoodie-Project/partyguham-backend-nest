import { User } from '../user';

export interface IUserRepository {
  findByNickname: (nickname: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  prepare: () => Promise<number>;
  create: (nickname: string, email: string, gender: string, birth: Date) => Promise<User>;
  update: () => Promise<void>;
}
