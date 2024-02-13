export interface IUserSkillRepository {
  create: (userId: number, skills: number[]) => Promise<void>;
}
