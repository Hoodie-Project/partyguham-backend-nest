import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PartyResponseDto } from './dto/response/party.response.dto';
import { PartyRecruitmentsResponseDto } from './dto/response/recruitment/party-recruitments.response.dto';
import { PartyRecruitmentResponseDto } from './dto/response/recruitment/party-recruitment.response.dto';
import { GetPartyRecruitmentsResponseDto } from './dto/response/recruitment/get-recruitments.response.dto';
import { PartyApplicationsResponseDto } from './dto/response/application/get-application.response.dto';

export class PartyRecruitmentSwagger {
  static getRecruitments() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 공고 목록 조회',
        description: `**파티모집을 모두 조회하는 API 입니다.**  
        사용처 : 홈페이지 파티모집 목록 조회

        배열 형식으로 존재하는 파티모집을 리턴합니다.  
        파티모집이 존재하지 않으면 빈 배열을 리턴합니다.  
      `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 모집 목록 조회',
        type: GetPartyRecruitmentsResponseDto,
      }),
    );
  }
  static getRecruitmentsPersonalized() {
    return applyDecorators(
      ApiOperation({
        summary: '개인화 - 파티 모집 공고 목록 조회',
        description: `**파티 모집 공고를 조회하는 API 입니다.**  
        사용처 : 홈페이지 맞춤 모집 공고 조회
        
        '주포지션에 대한 내용'에 대한 세부프로필이 없을 경우 결과를 보내지 않고, 404를 리턴합니다.
        배열 형식으로 존재하는 파티모집을 리턴합니다.  
        파티모집이 존재하지 않으면 빈 배열을 리턴합니다.  
      `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 200,
        description: '개인화된 파티 모집 목록 조회',
        type: GetPartyRecruitmentsResponseDto,
      }),
      ApiResponse({
        status: 404,
        description: '세부 프로필을 입력하지 않았습니다.',
        schema: {
          example: {
            message: '세부 프로필을 입력하지 않았습니다.',
            error: 'USER_PROFILE_NOT_EXIST',
            statusCode: 404,
            path: '/dev/api/parties/recruitments/personalized?page=1&limit=5&sort=createdAt&order=DESC',
            timestamp: '2024-09-25T21:20:23.932Z',
          },
        },
      }),
    );
  }

  static createRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 생성하기',
        description: `**새로운 파티 모집을 생성하는 API 입니다.**  
        recruitments에 배열 형식입니다.  
        한 번에 최소 1개, 최대 5개까지 데이터를 받아 모집 생성 가능합니다.  
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
        description: '파티 생성',
        type: PartyResponseDto,
      }),
    );
  }

  static getPartyRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 단일 조회',
        description: `**파티모집 단일 조회하는 API 입니다.**  
        
        - party.tag : 해당 파티의 상태를 나타냅니다.

        로그인이 되어있지 않거나 해당 파티에 속해있지 않으면 false 입니다.
        로그인이 되어있고, 파티에 속해있으면 true 입니다.
      `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}  
        access token은 선택값 입니다.
        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 모집 정보',
        type: PartyRecruitmentResponseDto,
      }),
    );
  }

  static getPartyRecruitments() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 목록 조회',
        description: `**파티에 있는 파티모집을 모두 조회하는 API 입니다.**  
        배열 형식으로 존재하는 파티모집을 리턴합니다.  
        파티모집이 존재하지 않으면 빈 배열을 리턴합니다.  
      `,
      }),
      ApiResponse({
        status: 200,
        description: '파티에 해당하는 목록 조회',
        type: [PartyRecruitmentsResponseDto],
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
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 200,
        description: '모집 수정',
        type: PartyRecruitmentsResponseDto,
      }),
    );
  }

  static batchDeleteRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '여러 개의 특정 파티 모집 삭제',
        description: `**파티모집을 삭제하는 API 입니다.**  
        삭제할 레코드의 ID를 배열 형태로 요청 본문에 포함하여 전송합니다.
        사용자가 지정한 ID 배열을 기반으로 해당 레코드를 일괄적으로 삭제합니다.
        `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 204,
        description: '모집 삭제',
      }),
      ApiResponse({
        status: 500,
        description: '서버 오류',
      }),
    );
  }

  static deleteRecruitment() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 모집 삭제',
        description: `**파티에서 partyRecruitmentId에 해당하는 파티모집을 삭제하는 API 입니다.**  
        데이터를 완전 삭제 합니다.
      `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 204,
        description: '모집 삭제',
      }),
    );
  }

  static createPartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 지원하기',
        description: `**파티 지원하는 API 입니다.**  
        지원 중복은 불가합니다.
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
        description: '파티 지원 완료',
      }),
    );
  }

  static getPartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 포지션 모집별, 지원자 조회',
        description: `**파티 포지션 모집별, 지원자 조회하는 API 입니다.**  
        
          `,
      }),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 200,
        description: '파티 지원자 조회',
        type: PartyApplicationsResponseDto,
      }),
      ApiResponse({
        status: 401,
        description: '파티 지원자 조회 권한이 없습니다.',
      }),
    );
  }
}
