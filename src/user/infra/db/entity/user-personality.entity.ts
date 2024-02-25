import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { PersonalityOptionEntity } from 'src/personality/entity/personality-option.entity';

@Entity('user_personality')
export class UserPersonalityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  PersonalityId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PersonalityOptionEntity, (Personality) => Personality.userPersonalitys)
  @JoinColumn({ name: 'personality_option_id' })
  Personality: PersonalityOptionEntity;
}
