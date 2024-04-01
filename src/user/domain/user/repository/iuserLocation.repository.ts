import { UserLocationEntity } from 'src/user/infra/db/entity/user-location.entity';

export interface IUserLocationRepository {
  findByUserId: (userId: number) => Promise<UserLocationEntity[]>;
  bulkInsert: (
    userId: number,
    locationIds: number[],
  ) => Promise<
    ({
      userId: number;
      locationId: number;
    } & UserLocationEntity)[]
  >;
}
