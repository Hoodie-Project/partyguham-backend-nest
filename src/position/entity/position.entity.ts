import { PartyUserEntity } from 'src/party/infra/db/entity/party/party-user.entity';
import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('postion')
export class PositionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @OneToMany(() => PartyUserEntity, (position) => position.position)
  partyUsers: PartyUserEntity[];

  @OneToMany(() => UserEntity, (user) => user.positions)
  users: UserEntity;
}
