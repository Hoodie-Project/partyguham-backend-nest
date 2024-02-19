import { UserSkillEntity } from 'src/user/infra/db/entity/user-skill.entity';

export class User {
  constructor(
    public id: number,
    public account: string,
    public nickname: string,
    public email: string,
    public gender: string,
    public birth: Date,
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
