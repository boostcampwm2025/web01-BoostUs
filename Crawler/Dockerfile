# Crawler/Dockerfile

# ---------- deps ----------
  FROM node:20-alpine AS deps
  WORKDIR /app
  
  COPY package.json package-lock.json ./
  RUN npm ci
  
  
  # ---------- build ----------
  FROM deps AS build
  WORKDIR /app
  
  COPY tsconfig.json ./
  COPY src ./src
    
  RUN npm run build
  
  
  # ---------- runner ----------
  FROM node:20-alpine AS runner
  WORKDIR /app
  
  # prod 전용 의존성 설치
  COPY package.json package-lock.json ./
  RUN npm ci --omit=dev
  
  COPY --from=build /app/dist ./dist
  
  CMD ["node", "dist/index.js"]