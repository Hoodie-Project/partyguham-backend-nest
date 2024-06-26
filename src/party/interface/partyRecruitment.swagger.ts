import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PartyResponseDto } from './dto/response/party.response.dto';
import { RecruitmentResponseDto } from './dto/response/recruitment.response.dto';

export class PartyRecruitmentSwagger {
  static createRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 생성하기',
        description: `**새로운 파티 모집을 생성하는 API 입니다.**  
        recruitments에 배열 형식입니다.  
        한 번에 최소 1개, 최대 5개까지 데이터를 받아 모집 생성 가능합니다.  
        `,
      }),
      ApiResponse({
        status: 201,
        description: '파티 생성',
        type: PartyResponseDto,
      }),
    );
  }

  static getPartyRecruitments() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 목록 조회',
        description: `**파티(partyId)에 있는 파티모집을 모두 조회하는 API 입니다.**  
        배열 형식으로 존재하는 파티모집을 리턴합니다.  
        파티모집이 존재하지 않으면 빈 배열을 리턴합니다.  
      `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 모집 목록 조회',
        type: [RecruitmentResponseDto],
      }),
    );
  }

  static updateRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 수정',
        description: `**파티(partyId)에 있는 파티모집을 수정하는 API 입니다.**  
        
      `,
      }),
      ApiResponse({
        status: 200,
        description: '모집 수정',
        type: RecruitmentResponseDto,
      }),
    );
  }

  static deleteRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 삭제',
        description: `**파티(partyId)에 있는 파티모집을 삭제하는 API 입니다.**  
        데이터를 완전 삭제 합니다.
      `,
      }),
      ApiResponse({
        status: 204,
        description: '모집 삭제',
      }),
    );
  }
}
