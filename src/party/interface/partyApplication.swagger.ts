import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PartyResponseDto } from './dto/response/party.response.dto';
import { PartyRecruitmentsResponseDto } from './dto/response/recruitment/party-recruitments.response.dto';
import { PartyRecruitmentResponseDto } from './dto/response/recruitment/party-recruitment.response.dto';
import { GetPartyRecruitmentsResponseDto } from './dto/response/recruitment/get-recruitments.response.dto';
import { PartyApplicationsResponseDto } from './dto/response/application/get-application.response.dto';

export class PartyApplicationSwagger {
  static approvePartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 지원자 승인',
        description: `**파티 지원자 승인하는 API 입니다.**  
        
          `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 201,
        description: '파티 지원자 승인 완료, 지원자도 수락을 해야 합니다.',
        schema: { example: { message: '지원자를 수락 하였습니다.' } },
      }),
      ApiResponse({
        status: 403,
        description: '파티 모집 권한이 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '승인하려는 지원데이터가 없습니다. \t\n 요청한 파티가 유효하지 않습니다.',
      }),
    );
  }

  static rejectPartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 지원자 거절',
        description: `**파티 지원자 거절하는 API 입니다.**  
        
          `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 201,
        description: '파티 지원자 거절 완료',
        schema: { example: { message: '지원자를 거절 하였습니다.' } },
      }),
      ApiResponse({
        status: 403,
        description: '파티 자원자에 대한 거절 권한이 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '거절 하려는 파티 지원자 데이터가 없습니다. \t\n 요청한 파티가 유효하지 않습니다.',
      }),
    );
  }
}
