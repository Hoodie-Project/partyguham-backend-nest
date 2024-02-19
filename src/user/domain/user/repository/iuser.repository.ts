import { User } from '../user';

export interface IUserRepository {
  findByAccount: (account: string) => Promise<User>;
  findByNickname: (nickname: string) => Promise<User | null>;
  create: (account: string, nickname: string, email: string, gender: string, birth: Date) => Promise<User>;
  update: () => Promise<void>;
}
