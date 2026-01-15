오늘은 일주일 간 나를 골머리 아프게 했던 Max client connections reached 에러 해결 방법에 대해 기록하고자 한다.
이 문제를 해결하면서 데이터베이스의 연결 관리와 최적화에 대해 많은 것을 배울 수 있었다.

# 1. 문제 상황

1. 개발자 두명이 동시에 스프링부트 서버로 작업을 하고 있는 상황이다.
   - 이 서버는 한 개의 PostgreSQL DB를 바라보고 있다.
2. 이 상태에서 새롭게 DB에 조회를 시도하려고 하면 `[XX000] FATAL: Max client connections reached` 오류가 발생한다.
3. 스프링부트 서버를 종료하면 오류가 사라졌다.

# 2. 원인 분석

## Supabase란?

Supabase는 **PostgreSQL**을 기반으로 하며, 실시간 웹 소켓 기능과 REST API를 제공하여 개발자들이 애플리케이션을 구축하고 데이터를 관리할 수 있도록 다양한 기능을 제공하는 오픈 소스 서버리스 클라우드 데이터베이스이다.

## Supabase Log에서는 무슨 일이..?

Supabase의 가장 큰 장점은 이러한 문제가 생겼을 때 에러 로그를 잘 시각화해서 보여준다.
![](https://velog.velcdn.com/images/dongho18/post/c5c15a92-68b8-47f1-8482-38767bbce20a/image.png)
원인 분석을 위해 `내 프로젝트 > Logs > Pooler`로 들어가보았다.
사진에는 나오지 않았지만 오류가 발생할 당시에 `ClientHandler: Max Client Connections Reached` 로그가 1분에 한 번꼴로 발생하고 있었다. (멘붕)
이 로그는 현재 `Pooler` 단에서 발생하기 때문에 `DB Connection Pool`에 문제가 있을 것이라고 가설을 세웠다.

# 3. 가설 검증

## DB Connection Pool

> [DBCP (DB connection pool)의 개념부터 설정 방법까지!](https://youtu.be/zowzVqx3MQ4?si=Gu_iGSOYYv89ZL1B)

혹시라도 DB Connection Pool를 처음 들어보았다면 위의 영상부터 본 뒤에 블로그 글을 이어서 보는걸 추천한다.
이 영상을 보고 난 다음에 문제를 해결하는데 큰 도움이 되었기 때문이다.

![](https://velog.velcdn.com/images/dongho18/post/1876edcc-e48c-472f-80e1-4092d9602d52/image.png)

Supabase는 [Supavisor](https://github.com/supabase/supavisor)라고 하는 Postgres 연결 풀러를 사용한다. 이 풀러는 기존의 PgBouncer의 단점을 개선한 것이다.

문제는 이 Supavisor에서 발생했다.

![](https://velog.velcdn.com/images/dongho18/post/527c0e83-5ccf-4ddb-a68a-fc42fc17b8a7/image.png)

Supabase 데이터베이스 크기 별 기본 설정값을 보자.

- `default_pool_size`: Supavisor에서 데이터베이스로의 연결 수(변경 가능)
- `max_connections`: Postgres가 허용하도록 구성된 최대 직접 연결 수(변경 가능)
- `default_max_clients` : Supavisor에 연결할 수 있는 최대 클라이언트 수(변경 불가능)

우리 프로젝트는 Supabase `micro` size 데이터베이스(무료 플랜)를 사용하고 있었는데, `default_pool_size`가 15로 작게 설정돼있어 문제가 됐다.

![](https://velog.velcdn.com/images/dongho18/post/3c6162ac-efec-459e-be00-4ff46f646e2e/image.png)

상황을 그림으로 정리하자면 다음과 같다.
우리는 스프링 서버를 두 개를 같이 켜면 하나는 되고 나머지 하나에서는 문제가 발생한다.
왜 그럴까?

## JDBC Connection Pool

우리는 DB 서버의 Connection Pool 사이즈 기본 값이 15인걸 알았다.
하지만, 스프링 서버에도 Connection Pool이 있다는 사실을 알아야 한다.

Spring Boot 2.0 이후부터는 이 커넥션 풀을 관리하기 위해 [HikariCP](https://github.com/brettwooldridge/HikariCP) 라고 하는 가벼운 용량과 빠른 속도를 가지는 우수한 성능의 JDBC Connection Pool 프레임워크를 사용한다.

이 HikariCP의 `minimumIdle` 과 `maximumPoolSize` 의 기본 값은 10이다.
즉, 아무 요청도 안 보내고 서버를 켜두기만 해도 10개의 커넥션을 DB랑 미리 연결해두겠다는 말이다.

두 개의 스프링부트 서버에서 각각 10개의 커넥션을 요청하면 총합 20개로, Supavisor의 default pool size인 15를 초과하면서 `Max Client Connections Reached` 에러를 내뱉는 것이다.

![](https://velog.velcdn.com/images/dongho18/post/2b1db4ad-7e7a-47c1-93f6-97c3c7e13bce/image.png)

이제 이 문제를 해결하기 위해 두 가지 방법 중 한가지를 택할 수 있다.

1. DB Connection Pool Size(15)를 늘린다.
2. JDBC Maximum Pool Size(10)을 줄인다.

![](https://velog.velcdn.com/images/dongho18/post/29aaf1d8-7076-4487-a82b-af0f67a31d02/image.png)

내가 생각한 가장 이상적인 방법은 운영 환경의 서버에서는 pool size를 디폴트 값인 10으로 두고, 나머지 개발 환경의 서버에서는 값을 1~2로 줄여버리는 방법을 생각했다.

하지만, 일단 임시 방편으로 pool size를 30으로 늘리는 것으로 조치를 취해보겠다.
Supabase 웹페이지에서 `Project Settings > Database > Connection pooling configuration` 를 살펴보자.
사진에 있는 Pool Size가 처음 기본값으로 15로 설정이 돼있을텐데, 이 값을 30으로 바꿔준다.

![](https://velog.velcdn.com/images/dongho18/post/0dbd9e4f-48ed-4409-a2fa-d423b6c8ea25/image.png)

한번 실제로 연결이 잘 됐는지 살펴보자.
DB 쿼리문에 다음과 같이 입력한다.

```
SELECT * FROM pg_stat_activity WHERE application_name = 'PostgreSQL JDBC Driver';
```

스프링부트 서버를 한개만 켰을 때는 예상한대로 10개의 커넥션이 idle 상태로 연결된다.

![](https://velog.velcdn.com/images/dongho18/post/59065424-8f1b-4f30-850f-abf3c13d6e7f/image.png)

스프링부트 서버를 한개 더 켜본 다음에 쿼리를 다시 입력해보자.

![](https://velog.velcdn.com/images/dongho18/post/5229074f-9ae7-49f5-81d7-3f6634e2f5c6/image.png)

문제 없이 20개 모두 커넥션이 연결되었다.

# 결론

이 문제는 이론보다는 실무에서 경험을 통해 더 많이 배우게 되는 사례 중 하나라고 생각한다. 실제로 프로젝트를 진행하다 보면, 특히 여러 명의 개발자가 동시에 작업하는 환경에서는 다양한 문제가 발생할 수 있으며, 그 중 하나가 바로 이 DB 커넥션 풀 관련 문제인 것 같다.

## 깨달은 점

### 자원 관리의 중요성

데이터베이스 연결은 제한된 자원이다. 각 어플리케이션이 너무 많은 연결을 사용하게 되면, 데이터베이스는 새로운 연결 요청을 처리할 수 없게 되고, 결국 "Max client connections reached"와 같은 오류가 발생한다.

### 설정 조정 및 최적화

각 환경에 맞는 적절한 설정을 적용하는 것이 중요하다는 것을 깨달았다. 운영 환경에서는 안정성과 성능을 최우선으로 하여 설정을 조정하고, 개발 환경에서는 자원의 효율적인 사용을 위해 설정을 조정해야 한다.

### 모니터링과 문제 해결

Supabase와 같은 서비스는 로그와 모니터링 도구를 통해 문제의 원인을 파악하는 데 큰 도움이 됐다. 이러한 도구들을 적극적으로 활용하여 문제를 신속하게 파악하고 해결하는 능력을 길러야겠다.

# 참고 문서

[Connecting to your database | Supabase Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
[JDBC Connection 에 대한 이해, HikariCP 설정 팁](https://jiwondev.tistory.com/291)
[DBCP (DB connection pool)의 개념부터 설정 방법까지! hikariCP와 MySQL을 예제로 설명합니다! 이거 잘 모르면 힘들..](https://www.youtube.com/watch?v=zowzVqx3MQ4&t=1657s&ab_channel=쉬운코드)
[Pool Modes - supavisor](https://supabase.github.io/supavisor/configuration/pool_modes/)
https://github.com/supabase/supavisor
[[Spring Boot] Hikari CP 커스텀으로 성능 최적화하기](https://velog.io/@dongvelop/Spring-Boot-Hikari-CP-커스텀으로-성능-최적화하기)
[HikariCP Dead lock에서 벗어나기 (이론편) | 우아한형제들 기술블로그](https://techblog.woowahan.com/2664/)
[Spring Boot Hikari Connection Pool 에러 핸들링](https://jgrammer.tistory.com/entry/Spring-Boot-Hikari-Connection-Pool-에러-핸들링)
[NodeJS 와 PostgreSQL Connection Pool](https://jojoldu.tistory.com/634)
[Supavisor 1.0: a scalable connection pooler for Postgres](https://supabase.com/blog/supavisor-postgres-connection-pooler)
[REST API | Supabase Docs](https://supabase.com/docs/guides/api)
[[데이터베이스] Connection Pool이란?](https://steady-coding.tistory.com/564)
