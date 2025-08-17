import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

// (처리 상태 그룹)
// [PENDING]
//    |
//    v
// [APPROVED] --> [PROCESSING] --> [COMPLETED]
//    |                                ↑
//    v                                |
// [REJECTED]                      [CANCELED]
//                                     |
//                                 [EXPIRED]

// (활성화)
// [ACTIVE]
//    |
//    v
// [INACTIVE] <--> [SUSPENDED]
//    |
//    v
// [ARCHIVED]
//    |
//    v
// [DELETED]

// # 상태와 무관하게 언제든 갈 수 있는 전이
//   ┌─────────────────────────────┐
//   ↓                             ↓
// [DELETED]                   [ARCHIVED]

export enum StatusEnum {
  ACTIVE = 'active', //* 데이터가 활성화되어 사용 가능한 상태
  INACTIVE = 'inactive', //* 데이터가 비활성화되어 사용 불가능한 상태
  DELETED = 'deleted', //* 데이터가 삭제된 상태
  PENDING = 'pending', // 데이터가 처리 대기 중인 상태
  PROCESSING = 'processing', // 데이터가 처리 중인 상태
  COMPLETED = 'completed', // 데이터가 처리 완료된 상태
  APPROVED = 'approved', // 데이터가 승인된 상태
  REJECTED = 'rejected', // 데이터가 거절된 상태
  SUSPENDED = 'suspended', // 데이터가 일시 중지된 상태
  CANCELED = 'canceled', // 데이터가 취소된 상태
  EXPIRED = 'expired', // 데이터가 유효기간이 만료된 상태
  ARCHIVED = 'archived', //* 데이터가 보관된 상태
}

@Entity()
export class BaseEntity {
  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
