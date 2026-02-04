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
COPY prisma.config.ts ./
COPY src ./src
COPY prisma ./prisma

# generate는 DB 접속 안 하므로 더미 DB_URL 사용
ENV DB_URL="mysql://user:pass@localhost:3306/db"
RUN npx prisma generate

RUN npm run build


# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# prod 전용 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# prisma migrate deploy: schema(진입점·provider), config(DB_URL), migrations
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["node", "dist/main.js"]    