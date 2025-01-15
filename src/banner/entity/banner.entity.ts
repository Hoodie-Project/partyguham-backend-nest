import { BaseEntity } from 'src/common/entity/baseEntity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum BannerPlatformEnum {
  Web = 'web',
  App = 'app',
}

@Entity('banner')
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: BannerPlatformEnum })
  platform: BannerPlatformEnum;

  @Column({ nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  image: string;

  @Column('text', { nullable: true, default: null })
  link: string;
}
