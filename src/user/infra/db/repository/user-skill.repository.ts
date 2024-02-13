import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserSkillRepository } from 'src/user/domain/user/repository/iuser.skill.repository';
import { UserSkillEntity } from '../entity/user-skill.entity';

@Injectable()
export class UserSkillRepository implements IUserSkillRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserSkillEntity)
    private userSkillRepository: Repository<UserSkillEntity>,
  ) {}

  async create(userId: number, skills: number[]) {
    const userSkills = skills.map((skillId) => ({ userId, skillId }));
    await this.userSkillRepository.save(userSkills);
  }
}
