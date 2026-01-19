# ---------- Build ----------
FROM node:24-slim AS build
WORKDIR /app

# Install all deps to run build
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:24-slim AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci

# Provide Drizzle config and schema for CLI push
COPY drizzle.config.ts ./drizzle.config.ts
COPY src/db/schema.ts ./src/db/schema.ts

# Copy build output
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Start backend by pushing schema (no SQL migrations committed)
CMD ["sh", "-c", "npx drizzle-kit push --config=./drizzle.config.ts && node dist/index.js"]