import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PartyUserEntity } from './party_user.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';
import { PartyTypeEntity } from './party_type.entity';
import { PartyRecruitmentEntity } from '../apply/party_recruitment.entity';

@Entity('party')
export class PartyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partyTypeId: number;

  @Column({ nullable: true })
  title: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ default: null })
  image: string;

  @ManyToOne(() => PartyTypeEntity, (partyType) => partyType.parties, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_type_id', referencedColumnName: 'id' })
  partyType: PartyTypeEntity;

  @OneToMany(() => PartyUserEntity, (partyUser) => partyUser.party)
  partyUser: PartyUserEntity[];

  @OneToMany(() => PartyRecruitmentEntity, (partyRecruitment) => partyRecruitment.party)
  partyRecruitments: PartyRecruitmentEntity[];
}
