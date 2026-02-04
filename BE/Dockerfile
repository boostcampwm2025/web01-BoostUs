# BE/Dockerfile

# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# ---------- build ----------
FROM deps AS build
WORKDIR /app

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
COPY prisma ./prisma

# DB_URL 환경변수 주입 후 Prisma 스키마 생성
RUN --mount=type=secret,id=DB_URL \
    export DB_URL="$(cat /run/secrets/DB_URL)" && \
    npx prisma generate

RUN npm run build


# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# prod 전용 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# prisma migration을 위해 schema.prisma 및 migrations 폴더 복사
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations

EXPOSE 3000
CMD ["node", "dist/main.js"]    