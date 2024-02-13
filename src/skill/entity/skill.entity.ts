import { UserSkillEntity } from 'src/user/infra/db/entity/user-skill.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('skill')
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skill: string;

  @OneToMany(() => UserSkillEntity, (userSkill) => userSkill.skill)
  userSkills: UserSkillEntity[];
}
