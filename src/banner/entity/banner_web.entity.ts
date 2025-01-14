import { BaseEntity } from 'src/common/entity/baseEntity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banner')
export class BannerWebEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  image: string;

  @Column('text', { nullable: true, default: null })
  link: string;
}
