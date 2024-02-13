import { Follow } from '../follow';

export interface IFollowRepository {
  create: (userId: number, followId: number) => Promise<Follow>;
  delete: (userId: number, followId: number) => Promise<boolean>;
}
