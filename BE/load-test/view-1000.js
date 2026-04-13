import http from 'k6/http';
import { check } from 'k6';

/**
 * 시나리오: id=1 게시글을 처음 보는 서로 다른 사용자 1,000명이 동시 조회
 *
 * - vus: 1000, iterations: 1000 → VU당 1번 요청 (최대한 동시에 시작)
 * - bid 쿠키 없이 요청 → ViewerKeyGuard가 매 요청마다 새 UUID 발급 → 전원 첫 조회 처리
 * - jar.clear() → VU가 이전 Set-Cookie 응답을 재사용하지 않도록 차단
 */
export const options = {
  vus: 1000,
  iterations: 1000,
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:3000/api';
const STORY_ID = 1;

export default function () {
  const jar = http.cookieJar();
  jar.clear('http://localhost:3000');

  const res = http.post(`${BASE_URL}/stories/${STORY_ID}/view`);

  check(res, {
    'status 201': (r) => r.status === 201,
  });
}
