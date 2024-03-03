import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PersonalityOptionEntity } from './personality-option.entity';

@Entity('personality_question')
export class PersonalityQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @OneToMany(() => PersonalityOptionEntity, (personalityOption) => personalityOption.personalityQuestion)
  personalityOption: PersonalityOptionEntity[];
}
