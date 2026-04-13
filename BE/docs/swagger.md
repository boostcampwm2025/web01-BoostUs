# Swagger 문서화 가이드 (NestJS + applyDecorators 기반)

> 목적: 컨트롤러 메서드에 Swagger 데코레이터를 두껍게 붙이지 않고, 엔드포인트별 **단일 커스텀 데코레이터**(`@GetProjectSwagger()` 등)로 문서 정확도/일관성을 유지한다.  
> 원칙: **실제 API 동작(요청/응답/에러/래핑 포맷)과 Swagger 문서가 1:1로 매칭**되어야 한다.

---

## 0) 적용 방식 (필수)

- Swagger 데코레이터는 컨트롤러에서 직접 나열하지 않는다.
- `src/config/swagger/**/*.decorator.ts` 같은 위치에 **엔드포인트별 decorator 함수**로 분리한다.
- 각 decorator 함수는 `applyDecorators()`로 묶어서 반환한다.

decorator 함수 예시:

- `GetAllProjectSwagger()`
- `GetProjectSwagger()`
- `CreateProjectSwagger()`
- `UpdateProjectSwagger()`
- `DeleteProjectSwagger()`
- `UploadImageSwagger()`

---

## 1) applyDecorators 규칙

### 1.1 기본 형태

- 엔드포인트 1개당 decorator 함수 1개
- 함수명은 `Action + Resource + Swagger`로 통일

예:

- `GetAllProjectSwagger`
- `GetProjectSwagger`
- `CreateProjectSwagger`
- `UploadProjectThumbnailSwagger`

### 1.2 applyDecorators 내부 구성 순서

아래 순서로 나열해 가독성을 고정한다.

1. `ApiOperation`
2. `ApiParam` (있다면)
3. `ApiQuery` (있다면)
4. `ApiConsumes` (파일 업로드일 때)
5. `ApiBody` (body/파일 업로드일 때)
6. `ApiResponse` 계열 (성공 응답 → 에러 응답 순)

---

## 2) Swagger 데코레이터별 사용 원칙

### 2.1 ApiOperation (모든 엔드포인트 필수)

- `summary`: 목록에서 보이는 한 줄 설명
- `description`: 핵심 비즈니스 규칙/제약/필터/교체 규칙을 문장으로 명시

권장 규칙:

- summary: `동사 + 대상` (짧게)
  - 예: `프로젝트 목록 조회`, `프로젝트 상세 조회`, `프로젝트 생성`
- description: "무엇을/어떻게/제약"을 구체적으로
  - 예: pagination, 필터 조건, 전체 교체/부분 수정 규칙, 권한 조건 등

---

### 2.2 ApiParam (path param 있을 때 필수)

- `/:id` 같은 Path Parameter 문서화

규칙:

- `name`은 실제 라우트 파라미터와 동일
- `description`에 의미를 명확히
- `example` 또는 `schema`로 타입/예시를 분명히

---

### 2.3 ApiQuery (query param 있을 때 필수)

- 목록 조회/검색/필터에서 query를 받으면, 받는 query를 모두 명시한다.

규칙:

- 실제로 받는 query 파라미터를 `ApiQuery`로 모두 선언한다.
- description에는 "쿼리로 받는다" 같은 문장 대신 **의미/범위/예시**를 적는다.

---

### 2.4 ApiBody (body가 있는 요청 필수)

- POST/PUT/PATCH 등 request body 문서화

규칙:

- DTO 기반으로 문서화한다: `ApiBody({ type: CreateDto })`
- schema가 필요 없다면 DTO를 우선한다.

---

### 2.5 ApiConsumes + 파일 업로드 (파일 업로드 엔드포인트 필수)

규칙:

- `ApiConsumes('multipart/form-data')` 필수
- `ApiBody`에 `file`을 `format: binary`로 명시한다.
  - 예: `ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }}, required: ['file'] } })`

---

### 2.6 ApiResponse 계열 (모든 엔드포인트 필수)

- 응답 문서화
- 통일성 확보를 위해 **status를 항상 명시**한다.

규칙:

- 성공 응답(1개) + 실패 응답(필요한 만큼)
- 에러 응답은 엔드포인트 특성에 맞게 포함한다.
  - 예: 400/401/403/404/409/413/415 등
- 공통 응답 래퍼 포맷을 Swagger에도 반드시 반영한다.

---

## 3) 엔드포인트 유형별 "필수 템플릿"

> 아래 템플릿은 "최소 필수" 기준이다. 인증/권한/중복/용량 등 정책에 따라 에러 응답을 추가한다.

### 3.1 목록 조회 (GET /resources)

필수:

- ApiOperation
- 200 성공 응답

선택:

- ApiQuery (page/size/필터)
- pagination meta가 있다면 DTO/Schema로 문서화

---

### 3.2 상세 조회 (GET /resources/:id)

필수:

- ApiOperation
- ApiParam(id)
- 200 성공 응답(type=DetailDto)
- 404 실패 응답

선택:

- 400 파라미터 타입 불일치 (예: id에 숫자 대신 문자열)

---

### 3.3 생성 (POST /resources)

필수:

- ApiOperation
- ApiBody(CreateDto)
- 201 성공 응답(type=DetailDto)
- 400 실패 응답

선택:

- 401/403 (인증/권한)
- 409 (중복 생성)

---

### 3.4 수정 (PUT/PATCH /resources/:id)

필수:

- ApiOperation
- ApiParam(id)
- ApiBody(UpdateDto)
- 200 성공 응답(또는 204)
- 400, 404 실패 응답

중요:

- "전체 교체" / "부분 수정" 규칙을 description에 반드시 명시

---

### 3.5 삭제 (DELETE /resources/:id)

필수:

- ApiOperation
- ApiParam(id)
- 200 성공 응답(또는 204)
- 404 실패 응답

---

### 3.6 파일 업로드 (POST /resources/:id/upload)

필수:

- ApiOperation
- ApiConsumes('multipart/form-data')
- ApiBody(schema 또는 DTO)
- 200/201 성공 응답
- 400 실패 응답

선택:

- 413 (용량 초과)
- 415 (미지원 미디어 타입)

---

## 4) 공통 응답 래퍼(Wrapper) 반영 규칙 (중요)

- 서버가 공통 응답 포맷으로 래핑한다면 Swagger도 동일하게 래핑한다.
- Swagger 문서의 응답 스키마가 실제 응답과 다르면 문서는 "오답"이다.

예시(개념):

- 성공: `{ success: true, data: <T>, error: null }`
- 실패: `{ success: false, data: null, error: { code, message, ... } }`

가이드:

- wrapper를 Swagger 전역 스키마(components.schemas)로 만들고,
- 각 엔드포인트 응답에서 `data`에 실제 DTO를 매핑한다.

---

## 5) 스웨거 설정 시 권장 옵션(가이드)

- 기본적으로 정렬은 프로젝트 정책에 맞춘다.
- 문서 정확도(모델 깊이/표시)를 위해 expand depth를 조정한다.

권장:

- `defaultModelsExpandDepth`
- `defaultModelExpandDepth`

정렬(선택):

- tagsSorter / operationsSorter는 "팀 컨벤션"이 정해졌을 때만 적용한다.
- 정렬이 문서 가독성을 해치거나 컨트롤러 작성 순서와 어긋나면 적용하지 않는다.

---

## 6) 일관성 체크리스트 (PR 필수 점검)

- [ ] 모든 엔드포인트에 `ApiOperation`이 있는가?
- [ ] path param이 있으면 `ApiParam`을 선언했는가?
- [ ] query param이 있으면 `ApiQuery`를 선언했는가?
- [ ] body가 있으면 `ApiBody`를 선언했는가?
- [ ] 파일 업로드면 `ApiConsumes('multipart/form-data')` + body schema를 선언했는가?
- [ ] `ApiResponse`에 status를 항상 명시했는가?
- [ ] 에러 응답(400/404 등)을 엔드포인트 특성에 맞게 포함했는가?
- [ ] 문서 내용이 실제 동작과 1:1로 정확히 매칭되는가?
- [ ] 응답이 공통 래핑 포맷이라면 Swagger도 wrapper를 반영했는가?

---

## 7) agent 작업 지시

agent는 Swagger 작업 시 아래를 반드시 수행한다.

1. 컨트롤러에는 엔드포인트별 **단일 Swagger 데코레이터만** 남긴다.
2. Swagger 데코레이터는 `applyDecorators()` 기반으로 분리한다.
3. 요청 파라미터(path/query/body/file)와 응답(성공/실패)이 **실제 동작과 1:1**로 맞도록 문서화한다.
4. 공통 래퍼 포맷이 있다면 Swagger 응답 스키마도 반드시 래핑하여 문서화한다.
5. 작업 완료 후 6번의 체크리스트를 모두 통과해야 한다.
