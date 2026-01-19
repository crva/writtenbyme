# ---------- Base ----------
FROM node:24-slim AS base
ENV NODE_ENV=production

# ---------- Backend deps ----------
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production

# ---------- Backend build ----------
FROM node:24-slim AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# ---------- Frontend build ----------
FROM node:24-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---------- Production ----------
FROM node:24-slim AS prod
WORKDIR /app

# Backend runtime
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY backend/package.json ./backend/

# Frontend runtime (static only)
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Use local serve (no global install)
RUN npm install serve

EXPOSE 3000 3001

CMD sh -c "\
  cd backend && npm run db:push && node dist/index.js & \
  npx serve -s /app/frontend/dist -l 3000 & \
  wait"
