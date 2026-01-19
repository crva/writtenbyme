# WrittenByMe Backend

Express API server with Passportjs authentication and Drizzle ORM.

## Rate Limiting

This project uses `express-rate-limit` v8. To ensure IPv6 users cannot bypass limits, all custom `keyGenerator` functions use `ipKeyGenerator(req.ip)` instead of raw `req.ip`. See the library docs for details.
