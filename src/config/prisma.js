require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Driver adapter: Prisma Client talks to Postgres via the plain-JS `pg`
// driver instead of spawning/embedding its Rust query engine. See
// prisma/schema.prisma for why the native engine doesn't work on this host.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
