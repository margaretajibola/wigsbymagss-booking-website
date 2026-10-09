// One-off helper: prints all Service rows as JSON.
// Usage: node scripts/list-services.js
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const services = await prisma.service.findMany({
    orderBy: { id: 'asc' },
    select: { name: true, price: true, category: true, extraNotes: true },
  });
  console.log(JSON.stringify(services, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
