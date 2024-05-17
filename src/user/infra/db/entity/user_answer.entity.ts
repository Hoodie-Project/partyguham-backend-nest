import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { PersonalityOptionEntity } from 'src/personality/entity/personality_option.entity';

@Entity('user_answer')
@Unique(['userId', 'answerId'])
export class UserAnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  answerId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PersonalityOptionEntity, (personalityOptionEntity) => personalityOptionEntity.userPersonality)
  @JoinColumn({ name: 'answer_id' })
  personalityOptionEntity: PersonalityOptionEntity;
}
