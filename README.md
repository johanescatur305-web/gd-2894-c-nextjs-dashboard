## GD 2894 C Next.js Dashboard

This project completes the SIWEB Next.js assignment for chapters 1-6 using the official Next.js Learn dashboard flow.

### Local setup

1. Install dependencies
2. Copy `.env.example` to `.env.local`
3. Fill in `POSTGRES_URL`, `AUTH_SECRET`, and `AUTH_URL`
4. Run `pnpm dev`

### Database routes

- `GET /seed` seeds the Neon/Postgres database
- `GET /query` verifies the invoice/customer query from the module
