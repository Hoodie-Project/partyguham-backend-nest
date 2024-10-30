import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { PersonalityOptionEntity } from 'src/personality/entity/personality_option.entity';

@Entity('user_personality')
export class UserPersonalityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  personalityOptionId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PersonalityOptionEntity, (personalityOption) => personalityOption.userPersonalities)
  @JoinColumn({ name: 'personality_option_id' })
  personalityOption: PersonalityOptionEntity;
}
