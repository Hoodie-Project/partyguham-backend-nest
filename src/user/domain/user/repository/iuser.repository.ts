import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { User } from '../user';

export interface IUserRepository {
  findByAccount: (account: string) => Promise<User>;
  findByNickname: (nickname: string) => Promise<User | null>;
  create: (account: string, nickname: string, email: string) => Promise<UserEntity>;
  update: (is_party: boolean, meeting_type, meeting_week, meeting_time, mbti) => Promise<void>;
}
