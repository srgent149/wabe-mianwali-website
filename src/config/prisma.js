require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Driver adapter: Prisma Client talks to Postgres via the plain-JS `pg`
// driver instead of spawning/embedding its Rust query engine. See
// prisma/schema.prisma for why the native engine doesn't work on this host.
//
// Timeouts are explicit so a dead/stale connection fails fast and gets
// recycled instead of hanging every query on this route forever -- pg's
// defaults have no timeout at all, which previously caused every
// database-backed page to hang indefinitely once the pool got into a bad
// state (e.g. after a network blip between the host and Supabase).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: 30000,
  keepAlive: true,
});
pool.on('error', (err) => {
  // A backend connection died while idle in the pool (e.g. Supabase closed
  // it). Without this handler that's an unhandled 'error' event, which
  // crashes the whole Node process. pg still removes the dead client from
  // the pool on its own; we just need to observe the event, not act on it.
  console.error('Postgres pool error (idle client):', err.message);
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
