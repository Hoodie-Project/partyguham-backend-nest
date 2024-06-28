import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Party } from './party';

interface PartyData {
  id: number;
  partyTypeId: number;
  title: string;
  content: string;
  image: string;
}

@Injectable()
export class PartyFactory {
  constructor(private eventBus: EventBus) {}

  create(data: PartyData): Party {
    const { id, partyTypeId, title, content, image } = data;
    return new Party(id, partyTypeId, title, content, image);
  }

  reconstitute(id: number, partyTypeId: number, title: string, content: string, image: string): Party {
    return new Party(id, partyTypeId, title, content, image);
  }
}
