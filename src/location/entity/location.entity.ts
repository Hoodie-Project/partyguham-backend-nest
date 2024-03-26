import { UserLocationEntity } from 'src/user/infra/db/entity/user-location.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  province: string;

  @Column()
  city: string;

  @OneToMany(() => UserLocationEntity, (user) => user.location)
  userLocation: UserLocationEntity[];
}
