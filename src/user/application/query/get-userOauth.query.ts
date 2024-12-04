import { IQuery } from '@nestjs/cqrs';

export class GetUserOauthQuery implements IQuery {
  constructor(readonly userId: number) {}
}
