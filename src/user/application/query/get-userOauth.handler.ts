import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetUserOauthQuery } from './get-userOauth.query';
import { OauthService } from 'src/auth/oauth.service';

@QueryHandler(GetUserOauthQuery)
export class GetUserOauthHandler implements IQueryHandler<GetUserOauthQuery> {
  constructor(private oauthService: OauthService) {}

  async execute(query: GetUserOauthQuery) {
    const { userId } = query;

    const oauth = await this.oauthService.findByUserId(userId);

    if (!oauth) {
      throw new InternalServerErrorException('계정이 없습니다.');
    }

    const result = oauth.map((oauth) => {
      return oauth.provider;
    });

    return result;
  }
}
