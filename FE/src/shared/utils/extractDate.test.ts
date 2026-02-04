import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import extractDate from './extractDate';

describe('extractDate 유틸리티 함수', () => {
  // 기준 시간: 2024년 1월 1일 낮 12시 00분 00초
  const MOCK_NOW = new Date('2024-01-01T12:00:00.000Z');

  beforeEach(() => {
    // 1. 가짜 타이머 사용 선언
    vi.useFakeTimers();
    // 2. 시스템 시간을 특정 시점으로 고정
    vi.setSystemTime(MOCK_NOW);
  });

  afterEach(() => {
    // 3. 테스트가 끝나면 원래 시간으로 복구
    vi.useRealTimers();
  });

  describe('기본 유효성 검사', () => {
    it('입력값이 없거나 undefined이면 빈 문자열을 반환해야 한다', () => {
      expect(extractDate(undefined)).toBe('');
      // @ts-expect-error (JS 환경 고려)
      expect(extractDate(null)).toBe('');
    });

    it('날짜 문자열 길이가 10자리 미만이면 빈 문자열을 반환해야 한다', () => {
      expect(extractDate('2024')).toBe('');
      expect(extractDate('invalid')).toBe('');
    });
  });

  describe('Absolute 모드 (절대 날짜)', () => {
    it('formatType이 "absolute"이면 무조건 YYYY-MM-DD 형식만 반환해야 한다', () => {
      // 1년 전이든, 1분 전이든 상관없이 날짜만 나와야 함
      const pastDate = '2020-05-05T10:00:00.000Z';
      expect(extractDate(pastDate, 'absolute')).toBe('2020-05-05');

      const futureDate = '2099-12-31T23:59:59.000Z';
      expect(extractDate(futureDate, 'absolute')).toBe('2099-12-31');
    });
  });

  describe('Relative 모드 (상대 날짜)', () => {
    // 헬퍼 함수: 기준 시간(MOCK_NOW)에서 ms만큼 뺀 ISO 문자열 생성
    const getTimeAgo = (diffMs: number) => {
      return new Date(MOCK_NOW.getTime() - diffMs).toISOString();
    };

    it('미래의 시간이 입력되면 해당 날짜(YYYY-MM-DD)를 반환해야 한다', () => {
      // 1분 뒤
      const futureDate = new Date(MOCK_NOW.getTime() + 60 * 1000).toISOString();
      expect(extractDate(futureDate)).toBe(futureDate.slice(0, 10));
    });

    it('1분 미만 차이는 "방금"을 반환해야 한다', () => {
      // 30초 전
      const thirtySecAgo = getTimeAgo(30 * 1000);
      expect(extractDate(thirtySecAgo)).toBe('방금');
    });

    it('1분 이상 1시간 미만은 "n분 전"을 반환해야 한다', () => {
      // 1분 전
      expect(extractDate(getTimeAgo(1 * 60 * 1000))).toBe('1분 전');
      // 59분 전
      expect(extractDate(getTimeAgo(59 * 60 * 1000))).toBe('59분 전');
    });

    it('1시간 이상 1일 미만은 "n시간 전"을 반환해야 한다', () => {
      // 1시간 전
      expect(extractDate(getTimeAgo(1 * 60 * 60 * 1000))).toBe('1시간 전');
      // 23시간 전
      expect(extractDate(getTimeAgo(23 * 60 * 60 * 1000))).toBe('23시간 전');
    });

    it('1일 이상 1달(30일) 미만은 "n일 전"을 반환해야 한다', () => {
      // 1일 전 (24시간)
      expect(extractDate(getTimeAgo(24 * 60 * 60 * 1000))).toBe('1일 전');
      // 29일 전
      expect(extractDate(getTimeAgo(29 * 24 * 60 * 60 * 1000))).toBe('29일 전');
    });

    it('1달(30일) 이상 1년(365일) 미만은 "n개월 전"을 반환해야 한다', () => {
      // 30일 전 -> 1개월 전
      expect(extractDate(getTimeAgo(30 * 24 * 60 * 60 * 1000))).toBe(
        '1개월 전'
      );
      // 300일 전 -> 10개월 전
      expect(extractDate(getTimeAgo(300 * 24 * 60 * 60 * 1000))).toBe(
        '10개월 전'
      );
    });

    it('1년(365일) 이상은 "YYYY-MM-DD" 형식을 반환해야 한다', () => {
      // 365일 전 -> 날짜 그대로 반환
      const oneYearAgo = getTimeAgo(365 * 24 * 60 * 60 * 1000);
      expect(extractDate(oneYearAgo)).toBe(oneYearAgo.slice(0, 10));

      // 2년 전
      const twoYearsAgo = getTimeAgo(730 * 24 * 60 * 60 * 1000);
      expect(extractDate(twoYearsAgo)).toBe(twoYearsAgo.slice(0, 10));
    });
  });
});
