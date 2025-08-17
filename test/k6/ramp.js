import http from 'k6/http';
import { check } from 'k6';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // 에러율 < 1%
    http_req_duration: ['p(95)<300'], // 95% < 300ms
  },
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const r = http.get('https://partyguham.com');
  check(r, { 200: (res) => res.status === 200 });
}
