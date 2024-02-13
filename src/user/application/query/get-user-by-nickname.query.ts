import { IQuery } from '@nestjs/cqrs';

export class UserByNicknameQuery implements IQuery {
  constructor(readonly nickname: string) {}
}
