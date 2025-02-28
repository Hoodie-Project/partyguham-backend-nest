import { IQuery } from '@nestjs/cqrs';

export class GetUserCareerQuery implements IQuery {
  constructor(readonly userId: number) {}
}
