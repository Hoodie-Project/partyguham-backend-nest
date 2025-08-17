import http from 'k6/http';
import { sleep } from 'k6';

export const options = { vus: 20, duration: '1m' };

export default function () {
  const login = http.post(
    `https://partyguham.com/auth/login`,
    JSON.stringify({
      email: __ENV.EMAIL,
      password: __ENV.PASS,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  const token = login.json('accessToken');

  http.get(`https://partyguham.com/me`, { headers: { Authorization: `Bearer ${token}` } });
  sleep(1);
}
