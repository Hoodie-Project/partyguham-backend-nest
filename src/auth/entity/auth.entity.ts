import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/infra/db/entity/user.entity';

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'user_id',
  })
  @Column()
  userId: number;

  @ApiProperty({})
  @Column('varchar', { nullable: false })
  refreshToken: string;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToOne(() => UserEntity, (user) => user.auth, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  // user: UserEntity;
}
