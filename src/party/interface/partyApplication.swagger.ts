import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export class PartyApplicationSwagger {
  static approvePartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '유저가 파티 합류 최종 수락',
        description: `**유저가 지원한 파티에 합류를 수락하는 API 입니다.**   
        유저가 지원하여 파티장이 수락 후, 유저가 확인후 수락하여 파티원이 되는 경우 입니다.  
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
        description: '파티 지원자 승인 완료',
        schema: { example: { message: '합류를 최종 수락 하였습니다.' } },
      }),
      ApiResponse({
        status: 403,
        description: `본인이 지원 데이터만 수락 가능합니다.  
        파티장의 수락이 선행되어야 합니다.
        `,
      }),
      ApiResponse({
        status: 404,
        description: '승인하려는 지원데이터가 없습니다. \t\n 요청한 파티가 존재하지 않습니다.',
      }),
    );
  }

  static approveAdminPartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '파티장이 파티 지원자 수락',
        description: `**파티장이 파티 지원자를 수락하는 API 입니다.**   
        파티장이 파티지원자를 수락하고, 유저에 대한 응답(수락 또는 거절)을 받아야 합니다.  
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
        description: '승인하려는 지원데이터가 없습니다. \t\n 요청한 파티가 존재하지 않습니다.',
      }),
    );
  }

  static rejectPartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '유저가 지원한 파티 합류 최종 거절',
        description: `**유저가 파티 합류를 거절하는 API 입니다.**   
        유저가 지원하여 파티장이 수락 하였지만, 유저가 파티 합류를 최종 거절하는 경우 입니다.  
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
        schema: { example: { message: '지원을 거절 하였습니다.' } },
      }),
      ApiResponse({
        status: 403,
        description: `본인이 지원 데이터만 거절 가능합니다.  
        파티장의 수락이 선행되어야 합니다.  
        `,
      }),
      ApiResponse({
        status: 404,
        description: '거절 하려는 파티 지원자 데이터가 없습니다. \t\n 요청한 파티가 존재하지 않습니다.',
      }),
    );
  }

  static rejectAdminPartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '파티장이 파티 지원자를 거절',
        description: `**파티장이 파티 지원자를 거절하는 API 입니다.**  
        파티장이 파티지원자를 거절합니다.
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
        schema: { example: { message: '지원을 거절 하였습니다.' } },
      }),
      ApiResponse({
        status: 403,
        description: '파티 자원자에 대한 거절 권한이 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '거절 하려는 파티 지원자 데이터가 없습니다. \t\n 요청한 파티가 존재하지 않습니다.',
      }),
    );
  }

  static deletePartyApplication() {
    return applyDecorators(
      ApiOperation({
        summary: '유저가 파티 지원을 삭제(취소)',
        description: `**유저가 파티 지원을 삭제(취소)하는 API 입니다.**   
        유저가 지원내용은 삭제되고 보관되지 않습니다. 
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
        description: '파티 지원 삭제(취소) 완료',
      }),
      ApiResponse({
        status: 403,
        description: `본인이 지원 데이터만 삭제(취소) 가능합니다.  
        검토중(pending) 상태만 취소가 가능합니다.`,
      }),
      ApiResponse({
        status: 404,
        description: '삭제 하려는 파티 지원자 데이터가 없습니다. \t\n 요청한 파티가 존재하지 않습니다.',
      }),
    );
  }
}
