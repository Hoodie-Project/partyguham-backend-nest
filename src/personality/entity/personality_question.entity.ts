import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PersonalityOptionEntity } from './personality_option.entity';

@Entity('personality_question')
export class PersonalityQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('smallint')
  responseCount: number;

  @OneToMany(() => PersonalityOptionEntity, (personalityOption) => personalityOption.personalityQuestion)
  personalityOption: PersonalityOptionEntity[];
}
