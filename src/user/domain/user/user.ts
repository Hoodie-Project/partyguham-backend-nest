import { UserSkillEntity } from 'src/user/infra/db/entity/user-skill.entity';

export class User {
  constructor(
    public id: number,
    public account: string,
    public nickname: string,
    public email: string,
    public image: string | null = null,
    public isParty: boolean | null = null,
    public mbti: string | null = null,
    public hp: number | null = null,
    public mp: number | null = null,
    public userSkills: UserSkillEntity[] = [],
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }
}

export class UserSkill {
  constructor(
    public id: number,
    public level: number,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }
}
