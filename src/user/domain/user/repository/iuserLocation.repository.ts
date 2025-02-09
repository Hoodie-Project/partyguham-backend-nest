import { UserLocationEntity } from 'src/user/infra/db/entity/user_location.entity';

interface IUpdateUserLocation {
  id: number;
  userId: number;
  locationId: number;
}

export interface IUserLocationRepository {
  findById: (id: number) => Promise<UserLocationEntity>;
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
  bulkUpdate: (updateUserLocation: IUpdateUserLocation[]) => Promise<UserLocationEntity[]>;
  deleteById: (id: number) => Promise<boolean>;
  deleteByUserId: (userId: number) => Promise<boolean>;
}
