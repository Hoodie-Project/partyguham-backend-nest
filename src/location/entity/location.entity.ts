import { UserLocationEntity } from 'src/user/infra/db/entity/user-location.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  borough: string;

  @OneToMany(() => UserLocationEntity, (user) => user.location)
  userLocation: UserLocationEntity[];
}
