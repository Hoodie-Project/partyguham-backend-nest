import { IQuery } from '@nestjs/cqrs';

export class GetUserCarrerQuery implements IQuery {
  constructor(readonly userId: number) {}
}
