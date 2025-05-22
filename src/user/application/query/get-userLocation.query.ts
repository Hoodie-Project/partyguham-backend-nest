import { IQuery } from '@nestjs/cqrs';

export class GetUserLocationQuery implements IQuery {
  constructor(readonly userId: number) {}
}
