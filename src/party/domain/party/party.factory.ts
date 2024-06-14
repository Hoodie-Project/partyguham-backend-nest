import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Party } from './party';

interface PartyData {
  id: number;
  title: string;
  content: string;
  image: string;
}

@Injectable()
export class PartyFactory {
  constructor(private eventBus: EventBus) {}

  create(data: PartyData): Party {
    const { id, title, content, image } = data;
    return new Party(id, title, content, image);
  }

  reconstitute(id: number, title: string, content: string, image: string): Party {
    return new Party(id, title, content, image);
  }
}
