import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PartyEntity } from './party.entity';

@Entity('party_type')
export class PartyTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: string;

  @OneToMany(() => PartyEntity, (party) => party.partyType)
  parties: PartyEntity[];
}
