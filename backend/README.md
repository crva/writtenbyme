# WrittenByMe Backend

Express API server with Auth.js authentication and Prisma ORM.

## Setup

1. Start PostgreSQL with Docker:

```bash
docker-compose up -d
```

Database will be at `localhost:5432` with credentials `postgres:postgres`.

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file and generate AUTH_SECRET:

```bash
cp .env.example .env
npx auth secret
```

4. Set up database:

```bash
npm run prisma:migrate
```

5. Start development server:

```bash
npm run dev
```

5. Start development server:

```bash
npm run dev
```

## Docker Commands

- Start database: `docker-compose up -d`
- Stop database: `docker-compose down`
- View logs: `docker-compose logs -f postgres`
- Data persists in `postgres_data` volume even after container stops

## API Routes

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Articles

- `POST /api/articles` - Create article (requires token)
- `GET /api/articles/me/articles` - Get my articles (requires token)
- `PUT /api/articles/:id` - Update article (requires token)
- `DELETE /api/articles/:id` - Delete article (requires token)
- `GET /api/articles/:username/:articleSlug` - Get article by slug
- `GET /api/articles/user/:username` - Get user's articles

## Database

PostgreSQL database managed with Prisma. Schema defined in `prisma/schema.prisma`.

## Authentication

JWT-based authentication. Include token in Authorization header:

```
Authorization: Bearer <token>
```
