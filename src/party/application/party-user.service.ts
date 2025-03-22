import { Inject, Injectable } from '@nestjs/common';
import { PartyUserRepository } from '../infra/db/repository/party/party_user.repository';

@Injectable()
export class PartyUserService {
  constructor(
    @Inject('PartyUserRepository')
    private partyUserRepository: PartyUserRepository,
  ) {}

  async findMasterByUserId(userId: number) {
    return this.partyUserRepository.findMasterByUserId(userId);
  }
}
