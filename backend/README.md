# WrittenByMe Backend

Express.js API server providing authentication, article management, analytics tracking, and payment processing for the WrittenByMe blogging platform.

## Key Features

- **Authentication** - Magic link email authentication with Passport.js and session management
- **Article Management** - Full CRUD operations with slug-based URLs and privacy controls
- **Real-time Analytics** - Tracks page views, unique visitors, geographic data, and device info
- **Payment Integration** - Secure payment processing for premium subscriptions
- **Type-Safe Database** - Drizzle ORM with TypeScript for database operations
- **Security** - CORS protection, rate limiting, IPv6-aware IP tracking, cookie sessions
- **Structured Logging** - Comprehensive logging for debugging and monitoring
- **Email Delivery** - Magic link email authentication system

## API Routes

- `/auth` - Authentication (login, logout, register, magic links)
- `/articles` - Article CRUD operations
- `/analytics` - View tracking and analytics data
- `/user` - User profile and account management
- `/payments` - Payment and subscription processing

## Rate Limiting

This project uses `express-rate-limit` v8. To ensure IPv6 users cannot bypass limits, all custom `keyGenerator` functions use `ipKeyGenerator(req.ip)` instead of raw `req.ip`. See the library docs for details.

## Getting Started

```bash
npm install
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

## Database

Migrations are managed with Drizzle:

```bash
npm run db:generate  # Generate migrations
npm run db:push      # Push migrations to database
```

## Analytics

Articles automatically track reader statistics including:

- **Page Views**: Total number of views per article
- **Reading Time**: Average time spent reading each article
- **Geographic Data**: Country information from reader IP addresses
- **Device Info**: Operating system and browser breakdown

Authors can view these analytics in the article editor dashboard.

### How Analytics Work

- **View Tracking**: When someone reads your article, a view is recorded with:
  - IP address (converted to country)
  - Browser and OS information
  - Session duration
  - Timestamp

- **Geo-IP Lookup**: Uses geoip-lite library to convert IP addresses to country codes
- **User Agent Parsing**: Uses ua-parser-js to extract browser and OS information
- **Privacy**: IP addresses are NOT stored but only used for geolocation

## Architecture

```
Frontend (React + Zustand)
    ↓
API Client (Generic fetch wrapper)
    ↓
Backend (Express + PassportJS)
    ↓
Database (PostgreSQL)
```

## Environment Variables

See `.env.example` for required environment variables
