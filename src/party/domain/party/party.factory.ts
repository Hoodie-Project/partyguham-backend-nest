import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Party } from './party';

@Injectable()
export class PartyFactory {
  constructor(private eventBus: EventBus) {}

  create(id: number, title: string, content: string, image: string): Party {
    const party = new Party(id, title, content, image);

    return party;
  }

  reconstitute(id: number, title: string, content: string, image: string): Party {
    return new Party(id, title, content, image);
  }
}
