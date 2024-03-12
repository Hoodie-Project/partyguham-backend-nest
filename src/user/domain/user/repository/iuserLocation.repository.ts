export interface IUserLocationRepository {
  create: (userId: number, skills: number[]) => Promise<void>;
}
