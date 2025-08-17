import { IQuery } from '@nestjs/cqrs';

export class GetPartiesByNicknameQuery implements IQuery {
  constructor(
    readonly nickname: string,
    readonly page: number,
    readonly limit: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly status: string | undefined,
  ) {}
}
