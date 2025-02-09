export const SwaggerUserApi = {
  users: {
    register: {
      success: {
        status: 200,
        message: 'Created',
        description: '성공적으로 유저 목록을 가져왔습니다.',
        data: {
          data: [],
          count: 1,
        },
      },
    },
    error: {
      status: 400,
      message: 'Bad Request',
    },
  },

  login: {
    success: {
      status: 200,
      message: 'Login',
      data: 'a',
      token: 'string',
    },
    error: {
      status: 400,
      message: 'Bad Request',
    },
  },
};
