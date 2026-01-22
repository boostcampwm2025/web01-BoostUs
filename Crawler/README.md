# BoostUs RSS Crawler

RSS 피드를 주기적으로 수집하여 BoostUs BE API에 스토리를 저장하는 크롤러 서비스입니다.

## 기능

- RSS 2.0 피드 자동 수집
- 주기적 크롤링 (Cron)
- 중복 방지 (GUID 기반)
- BE API와 HTTP 통신

## 설치

```bash
npm install
```

## 환경 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정합니다.

```bash
cp .env.example .env
```

### 환경 변수

- `BE_API_URL`: BE 서버 URL (기본: http://localhost:3000)
- `CRON_SCHEDULE`: Cron 표현식 (기본: 매 시간)

## 실행

### 개발 모드

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 아키텍처

```
Crawler
├── feed-downloader   # RSS XML 다운로드
├── feed-parser       # XML → Story 객체 변환
├── be-api-client     # BE API 통신
├── feed-manager      # 오케스트레이션
└── scheduler         # Cron 스케줄링
```

## 작동 방식

1. 스케줄러가 설정된 주기마다 실행
2. BE API에서 활성 피드 목록 조회 (`GET /api/feeds`)
3. 각 피드에 대해:
   - RSS XML 다운로드
   - XML을 Story 객체로 파싱
   - BE API로 스토리 저장 (`POST /api/stories`)
4. 피드의 `lastFetchedAt` 자동 업데이트

## 라이선스

UNLICENSED
