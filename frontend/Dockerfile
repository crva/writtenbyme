# ---------- Build ----------
FROM node:24-slim AS build
WORKDIR /app

# Inject API URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Production ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA support: index.html fallback
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
