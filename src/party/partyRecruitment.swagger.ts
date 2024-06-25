import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PartyResponseDto } from './interface/dto/response/party.response.dto';

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
      `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 모집',
        schema: {
          example: [
            {
              id: 27,
              partyId: 78,
              positionId: 1,
              recruiting_count: 1,
              recruited_count: 0,
              position: {
                id: 1,
                main: '기획',
                sub: 'UI/UX 기획자',
              },
            },
            {
              id: 28,
              partyId: 78,
              positionId: 9,
              recruiting_count: 1,
              recruited_count: 0,
              position: {
                id: 9,
                main: '디자인',
                sub: '웹 디자이너',
              },
            },
          ],
        },
      }),
    );
  }
}
