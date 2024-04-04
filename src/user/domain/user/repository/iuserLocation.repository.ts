import { UserLocationEntity } from 'src/user/infra/db/entity/user-location.entity';

interface updateUserLocation {
  id: number;
  userId: number;
  locationId: number;
}

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
  bulkUpdate: (updateUserLocation: updateUserLocation[]) => Promise<UserLocationEntity[]>;
}
