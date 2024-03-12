import { UserPositionEntity } from 'src/user/infra/db/entity/user-career.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('postion')
export class PositionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  main: string;

  @Column()
  sub: string;

  @OneToMany(() => UserPositionEntity, (userPosition) => userPosition.position)
  userPositions: UserPositionEntity[];
}
