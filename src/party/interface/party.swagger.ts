import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PartyTypeResponseDto } from './dto/response/partyType.response.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { GetPartiesResponseDto } from './dto/response/get-parties.response.dto';
import { GetPartyResponseDto } from './dto/response/get-party.response.dto';
import { GetPartyUserResponseDto } from './dto/response/get-partyUser.response.dto';
import { GetAdminPartyUsersResponseDto } from './dto/response/get-admin-partyUser.response.dto';
import { GetSearchResponseDto } from './dto/response/get-partySearch.response.dto';
import { UpdatePartyResponseDto } from './dto/response/update-party.response.dto';

export class PartySwagger {
  static getSearch() {
    return applyDecorators(
      ApiOperation({
        summary: '파티/파티 모집공고 통합검색',
        description: `**파티, 파티모집공고를 통합검색 하는 API 입니다.**  

        '파티 제목'을 기준으로  
        - party (파티 목록)  
        - partyRecruitment (모집 공고 목록)  
        으로 나누어 동시에 조회하는 API 입니다.  

        default : 최신순 (생성, 내림차순) 으로 나열
        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 목록 리스트 조회',
        type: GetSearchResponseDto,
      }),
    );
  }

  static getParties() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 목록 조회',
        description: `**파티 목록을 조회하는 API 입니다.**  
        사용처 : 홈페이지 파티 목록 조회

        total : 파티 전체 데이터 수

        parties : 요청한 limit 만큼의 데이터를 리턴합니다.
        - partyType : 해당 파티의 타입을 나타냅니다.
        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 목록 리스트 조회',
        type: GetPartiesResponseDto,
      }),
    );
  }

  static getTypes() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 타입 목록 조회',
        description: `**파티에 타입을 결정하는 PK를 조회하는 API 입니다.**    
        파티를 생성 또는 조회 시 필요합니다 (partyTypeId).
        `,
      }),
      ApiResponse({
        status: 200,
        description: `파티 타입 목록 조회 성공  
        \`\`\`
        1.미정  2.스터디  3.포트폴리오  4.해커톤  5.공모전
        \`\`\`
        `,
        type: PartyTypeResponseDto,
      }),
    );
  }

  static createParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 생성',
        description: `**새로운 파티를 생성하는 API 입니다.**  
        1. multipart/form-data 형식을 사용합니다.  
        2. 이미지를 저장하는 key는 image 이며, 선택사항 (optional) 입니다.  
        \`\`\`image : 파티에 대한 이미지 파일을 업로드합니다. (jpg, png, jpeg 파일 첨부)  \`\`\`  
        3. 이미지 데이터가 없으면 **null** 으로 저장됩니다.  
        4. positionId : 파티를 생성하는 유저가 담당할 포지션 ID(PK)를 입력합니다.
        `,
      }),
      ApiConsumes('multipart/form-data'),
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
      ApiResponse({
        status: 204,
        description: 'Party Type이 존재하지 않습니다.',
      }),
    );
  }

  static getParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 단일 조회',
        description: `**파티 단일 조회하는 API 입니다.**  

        - partyType : 해당 파티의 타입을 나타냅니다.  
        - tag : 해당 파티의 상태를 나타냅니다.        
        `,
      }),

      ApiResponse({
        status: 200,
        description: '파티 상세 정보 조회',
        type: GetPartyResponseDto,
      }),
      ApiResponse({
        status: 404,
        description: '파티를 찾을 수 없습니다.',
      }),
    );
  }

  static getPartyUsers() {
    return applyDecorators(
      ApiOperation({
        summary: '파티원 목록 조회',
        description: `**파티원 목록 조회하는 API 입니다.**  
        - 필수 디폴트 값 : (order=ASC(오름차순) / sort=createdAt(합류일))  
        - 선택 옵션 : 직군 / 이름 

        1. 경력을 표시해야하는 상황은, 파티내 포지션과 개인정보 포지션이 동일할 경우 입니다.
        유저경력(userCareers) = 파티내 포지션(position.id)
        -> 경력 표시 (userCareers.years)
        
        2. 유저가 본인 경력을 입력하지 않으면 userCareers의 값은 빈 배열 입니다.

        3. 관리자(partyAdmin) / 파티원(partyUser) 을 구분하여 정보를 주고 있습니다.
        partyAdmin  
        - master (파티장)  
        - deputy (부파티장)  

        partyUser  
        - member (일반 파티원)  
        


        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티원 정보 조회',
        type: GetPartyUserResponseDto,
      }),
      ApiResponse({
        status: 404,
        description: `파티를 찾을 수 없습니다.`,
      }),
    );
  }

  static getPartyAuthority() {
    return applyDecorators(
      ApiOperation({
        summary: '나의 파티 권한 조회',
        description: `**나의 파티원 권한을 조회하는 API 입니다.**  
        파티에 속해있다면, 아래의 예시 처럼 권한을 리턴합니다.
        파티에 속해있지 않다면 '404'을 리턴합니다.  
        
        - master : 파티장
        - deputy : 부파티장
        - member : 파티원

        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 유저(partyUser) 권한 조회',
        schema: {
          example: {
            id: 73,
            authority: 'master',
            position: {
              id: 23,
              main: '개발자',
              sub: '백엔드',
            },
          },
        },
      }),
      ApiResponse({
        status: 404,
        description: `파티에 속한 유저를 찾을 수 없을 경우 입니다.`,
        schema: {
          example: {
            message: '파티에 속한 유저를 찾을 수 없습니다.',
            error: 'PARTY_USER_NOT_EXIST',
            statusCode: 404,
            path: '/dev/api/parties/801/users/me/authority',
            timestamp: '2024-11-07T10:07:24.272Z',
          },
        },
      }),
    );
  }

  static getAdminPartyUsers() {
    return applyDecorators(
      ApiOperation({
        summary: '관리자 - 파티원 목록 조회',
        description: `**관리자가 파티원 목록 조회하는 API 입니다.**  
        관리자/파티원를 구분하지 않습니다.

        total : 파티유저수

        - id : 파티 고유 ID 입니다 (PK)
        - partyUser : 파티에 속한 파티원 데이터 입니다.

        선택 옵션
        - 합류순 : order, sort 대입에 따른 조회
        
        기본 선택 옵션 값 (order=ASC(오름차순) / sort=createdAt(합류일))
        - 직군 / 이름 : 선택값. 이름 검색은 해당 검색 데이터가 포함된 모든 파티원 조회


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
        description: '파티원 정보 조회',
        type: GetAdminPartyUsersResponseDto,
      }),
      ApiResponse({
        status: 404,
        description: `파티를 찾을 수 없습니다.`,
      }),
    );
  }

  static updateParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 수정',
        description: `**파티를 수정하는 API 입니다.**  
        1. multipart/form-data 형식을 사용합니다.  
        2. 이미지를 수정하는 key는 image 입니다.  
        \`\`\`image : 파티에 대한 이미지 파일을 업로드합니다. (jpg, png, jpeg 파일 첨부)  \`\`\`  
        3. 모든 항목이 선택사항 (optional) 입니다.  
        4. 이미지 데이터가 없으면 변경하지 않습니다.  
        `,
      }),
      ApiConsumes('multipart/form-data'),
      ApiHeader({
        name: 'Authorization',
        description: `Bearer {access token}
        `,
        required: true,
      }),
      ApiResponse({
        status: 200,
        description: '파티 수정 완료',
        type: UpdatePartyResponseDto,
      }),

      ApiResponse({
        status: 400,
        description: '변경하려는 이미지 또는 정보가 없습니다.',
      }),
      ApiResponse({
        status: 403,
        description: '파티 수정 권한이 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '파티를 찾을 수 없습니다.',
      }),
    );
  }

  static deleteParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 삭제',
        description: `**파티를 삭제하는 API 입니다.**  
        파티 데이터를 완전 삭제 하지 않고, 상태값(party.status)을 삭제(deleted)로 변경하여 데이터를 유지합니다.
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
        description: '삭제 완료',
      }),
      ApiResponse({
        status: 403,
        description: '파티 삭제 권한이 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '파티를 찾을 수 없습니다.',
      }),
    );
  }

  static leaveParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 나가기',
        description: `**파티를 (본인) 스스로 나가는 API 입니다.**  
        파티장 권한을 가진 사람은 나가기 기능이 불가 합니다. 할 수 없습니다.  
        파티장 권한을 양도하고 나가기가 가능합니다.
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
        description: '파티 나가기 완료',
      }),
      ApiResponse({
        status: 403,
        description: '파티장은 파티를 나갈 수 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '파티유저를 찾을 수 없습니다. \t\n파티를 찾을 수 없습니다.',
      }),
    );
  }

  static updatePartyUser() {
    return applyDecorators(
      ApiOperation({
        summary: '파티원 데이터 변경',
        description: `**파티에 속해있는 유저 데이터를 변경하는 API 입니다.**  
        파티장 권한을 가진 사람만 가능한 기능입니다.  
        partyUserId (파티원 ID)에 대해 포지션 변경이 가능합니다.
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
        description: '변경 완료',
      }),
      ApiResponse({
        status: 403,
        description: '파티원 수정 권한이 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '파티유저를 찾을 수 없습니다. \t\n파티를 찾을 수 없습니다.',
      }),
    );
  }

  static kickUserFromParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티원 내보내기',
        description: `**파티에서 파티원을 추방시키는 API 입니다.**  
        파티장 권한을 가진 사람만 가능한 기능입니다.  
        partyUserId (파티원 ID)를 통해 유저를 내보냅니다.
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
        description: '삭제 완료',
      }),
      ApiResponse({
        status: 403,
        description: '파티원를 내보낼 권한이 없습니다.  파티장은 내보낼 수 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '파티유저를 찾을 수 없습니다. \t\n파티를 찾을 수 없습니다.',
      }),
    );
  }

  static kickUsersFromParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티원 다수 내보내기',
        description: `**파티에서 파티원 다수를 추방시키는 API 입니다.**  
        파티장 권한을 가진 사람만 가능한 기능입니다.  
        partyUserId (파티원 ID)를 통해 유저를 내보냅니다.
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
        description: '삭제 완료',
      }),
      ApiResponse({
        status: 403,
        description: '파티원를 내보낼 권한이 없습니다.  파티장은 내보낼 수 없습니다.',
      }),
      ApiResponse({
        status: 404,
        description: '파티유저를 찾을 수 없습니다. \t\n파티를 찾을 수 없습니다.',
      }),
    );
  }

  static deletePartyImage() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 이미지 삭제',
        description: `**파티 이미지를 삭제하는 API 입니다.**  
        파티 이미지를 서버에서 삭제하고, image 데이터를 **null**로 저장합니다.
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
        description: '삭제 완료',
      }),
      ApiResponse({
        status: 404,
        description: '파티를 찾을 수 없습니다.',
      }),
    );
  }

  static transferPartyLeadership() {
    return applyDecorators(
      ApiOperation({
        summary: '파티장 위임',
        description: `**파티장 위임하는 API 입니다.**  
        
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
        description: '위임 완료',
        schema: { example: { message: '파티장 권한이 변경 되었습니다.' } },
      }),
      ApiResponse({
        status: 403,
        description: `파티장 위임 권한이 없습니다.  
        파티원이 아닙니다.  
        파티유저를 찾을 수 없습니다.`,
      }),
      ApiResponse({
        status: 404,
        description: '파티를 찾을 수 없습니다.\t\n파티유저를 찾을 수 없습니다.',
      }),
      ApiResponse({
        status: 409,
        description: `완료된 파티 입니다.  
        위임하려는 유저 직책은 이미 파티장 입니다`,
      }),
    );
  }
}
