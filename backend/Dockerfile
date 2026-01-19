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

# Install all deps (including dev deps needed for drizzle-kit)
COPY package.json package-lock.json ./
RUN npm ci

# Copy build output
COPY --from=build /app/dist ./dist

# Copy drizzle config and migrations
COPY drizzle.config.ts ./

EXPOSE 3000

# Start backend
CMD ["sh", "-c", "npx drizzle-kit generate && npx drizzle-kit push && node dist/index.js"]