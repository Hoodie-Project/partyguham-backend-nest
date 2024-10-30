import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { LocationEntity } from 'src/location/entity/location.entity';

@Entity('user_location')
export class UserLocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  locationId: number;

  @ManyToOne(() => UserEntity, (user) => user.userLocations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => LocationEntity, (location) => location.userLocation)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;
}
