import { Module } from '@nestjs/common';
import { PersonalityController } from './personality.controller';
import { PersonalityService } from './personality.service';

@Module({
  controllers: [PersonalityController],
  providers: [PersonalityService],
})
export class PersonalityModule {}
