import { IQuery } from '@nestjs/cqrs';

export class GetCheckNicknameQuery implements IQuery {
  constructor(readonly nickname: string) {}
}
