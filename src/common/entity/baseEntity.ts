import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

export enum StatusType {
  ACTIVE = 'active', //* 데이터가 활성화되어 사용 가능한 상태
  INACTIVE = 'inactive', //* 데이터가 비활성화되어 사용 불가능한 상태
  SURVEY_READY = 'survey_ready', //* 설문조사 전 상태
  SURVEY_ONGOING = 'survey_ongoing', //* 설문조사 중 상태
  DELETED = 'deleted', //* 데이터가 삭제된 상태
  PENDING = 'pending', // 데이터가 처리 대기 중인 상태
  PROCESSING = 'processing', // 데이터가 처리 중인 상태
  COMPLETED = 'completed', // 데이터가 처리가 완료된 상태
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
    enum: StatusType,
    default: StatusType.ACTIVE,
  })
  status: StatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
