import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Guild } from './guild';

@Injectable()
export class GuildFactory {
  constructor(private eventBus: EventBus) {}

  create(id: number, title: string, content: string): Guild {
    const guild = new Guild(id, title, content);

    return guild;
  }

  reconstitute(id: number, title: string, content: string): Guild {
    return new Guild(id, title, content);
  }
}
