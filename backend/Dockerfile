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

# Copy build output
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Start backend
CMD ["sh", "-c", "node dist/index.js"]