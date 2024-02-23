import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { SkillEntity } from 'src/skill/entity/skill.entity';

@Entity('user_position')
@Unique(['userId', 'locationId'])
export class UserPositionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  locationId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => SkillEntity, (skill) => skill.userSkills)
  @JoinColumn({ name: 'location_id' })
  skill: SkillEntity;
}
