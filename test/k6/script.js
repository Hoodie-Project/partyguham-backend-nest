import http from 'k6/http';
import { check, sleep } from 'k6';

// 부하 테스트 설정
export let options = {
  vus: 1, // 동시에 접속할 가상 유저 수
  duration: '10m', // 테스트 지속 시간
};

export default function () {
  const refreshToken =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZzY2lGRDV3N3RRVFdjWWl2SFozb1E9PSIsImlhdCI6MTczNzAzMzE5NSwiZXhwIjoxNzM5NjI1MTk1fQ.xGVAE6UDiW39uVEhV5mr-AW_I4lNIhEB_zv9hiSpyVdMZwbq8L_GwMjqRrrw2Rg9iTEjeDyY_7HHhwhT9HgM-g'; // 실제 토큰 값
  const headers = {
    Authorization: `Bearer ${refreshToken}`,
  };
  const cookies = {
    refreshToken: refreshToken,
  };

  let res = http.post('https://partyguham.com/api/auth/access-token', null, { headers });

  check(res, {
    '응답 코드가 201인가?': (r) => r.status === 201,
  });

  sleep(1);
}
