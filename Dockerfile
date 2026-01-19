FROM node:24-alpine AS base
ENV NODE_ENV=production

FROM base AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM base AS prod
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY backend/package*.json ./backend/

# Copy frontend dist
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Install serve globally for frontend
RUN npm install -g serve

# Expose ports
EXPOSE 3001 3000

# Start both services
CMD ["sh", "-c", "cd /app/backend && npm run db:push && node dist/index.js & serve -s /app/frontend/dist -l 3000 & wait"]
