import { Inject, Injectable } from '@nestjs/common';
import { PartyApplicationRepository } from '../infra/db/repository/party_application.repository';

@Injectable()
export class PartyApplicationService {
  constructor(
    @Inject('PartyApplicationRepository')
    private partyApplicationRepository: PartyApplicationRepository,
  ) {}

  async deletePartyApplicationByUserId(userId: number) {
    this.partyApplicationRepository.deleteByUserId(userId);
  }
}
