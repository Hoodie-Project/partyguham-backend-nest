import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { UserCareerEntity } from 'src/user/infra/db/entity/user_career.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('report')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  typeId: number;

  @Column()
  content: string;

  @OneToMany(() => UserCareerEntity, (userCareer) => userCareer.position)
  userPositions: UserCareerEntity[];

  @OneToMany(() => PartyUserEntity, (partyUser) => partyUser.position)
  partyUsers: PartyUserEntity[];

  @OneToMany(() => PartyRecruitmentEntity, (partyRecruitment) => partyRecruitment.position)
  partyRecruitments: PartyRecruitmentEntity[];
}
