// Production-safe seed: creates only the admin login, none of the demo
// students/faculty/fee-challan sample data from prisma/seed.js. Use this
// against the live database; use `npm run seed` only for local/dev.
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD before running this script.');
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`Admin user ${adminEmail} already exists — nothing to do.`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.create({ data: { email: adminEmail, passwordHash } });
  console.log(`Admin user created: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
