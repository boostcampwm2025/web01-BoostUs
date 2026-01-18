# BE/Dockerfile

# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# ---------- prisma ----------
FROM deps AS prisma
WORKDIR /app

COPY prisma ./prisma
RUN npx prisma generate


# ---------- build ----------
FROM prisma AS build
WORKDIR /app

COPY tsconfig.json nest-cli.json ./
COPY src ./src

RUN npm run build


# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# prod 전용 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]    