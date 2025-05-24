import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('version')
export class VersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  platform: string; // 'android', 'ios' 등

  @Column({ type: 'varchar', length: 20, name: 'latest_version' })
  latestVersion: string;

  @Column({ type: 'varchar', length: 20, name: 'min_required_version', nullable: true })
  minRequiredVersion: string;

  @Column({ type: 'text', name: 'release_notes', nullable: true })
  releaseNotes: string;

  @Column({ type: 'boolean', name: 'is_force_update', default: false })
  isForceUpdate: boolean;

  @Column({ type: 'varchar', length: 255, name: 'download_url', nullable: true })
  downloadUrl: string;
}
