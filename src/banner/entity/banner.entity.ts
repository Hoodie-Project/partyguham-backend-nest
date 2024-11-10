import { BaseEntity } from 'src/common/entity/baseEntity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banner')
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column('varchar', { nullable: true })
  image: string;
}
