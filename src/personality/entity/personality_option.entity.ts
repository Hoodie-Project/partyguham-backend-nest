import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PersonalityQuestionEntity } from './personality_question.entity';
import { UserPersonalityEntity } from 'src/user/infra/db/entity/user_personality.entity';

@Entity('personality_option')
export class PersonalityOptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  personalityQuestionId: number;

  @Column('text')
  content: string;

  @ManyToOne(() => PersonalityQuestionEntity, (position) => position.personalityOptions)
  @JoinColumn({ name: 'personality_question_id' })
  personalityQuestion: PersonalityQuestionEntity;

  @OneToMany(() => UserPersonalityEntity, (userPersonalities) => userPersonalities.personalityOption)
  userPersonalities: UserPersonalityEntity[];
}
