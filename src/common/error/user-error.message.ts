export const USER_ERROR = {
  USER_FORBIDDEN_DISABLED: {
    message: '로그인 불가 계정입니다.',
    error: 'USER_FORBIDDEN_DISABLED',
    statusCode: 403,
  },
  USER_DELETED_30D: {
    message: '회원 탈퇴 후 30일 보관 중인 계정입니다.',
    error: 'USER_DELETED_30D',
    statusCode: 403,
  },
  USER_DELETED: {
    message: '삭제된 계정입니다.',
    error: 'USER_DELETED',
    statusCode: 403,
  },
};
