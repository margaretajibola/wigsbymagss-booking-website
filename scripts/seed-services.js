// One-off helper: seeds the Service table with the current local service
// list. Safe to re-run — skips any service whose name already exists so it
// won't create duplicates.
//
// Usage (run against production):
//   DATABASE_URL="<production connection string>" node scripts/seed-services.js
const { PrismaClient } = require('@prisma/client');

const services = [
  { name: "Frontal Install", price: 120, category: "Installations", extraNotes: "Includes braid down and styling" },
  { name: "Closure Install", price: 100, category: "Installations", extraNotes: "Includes braid down and styling" },
  { name: "Frontal Re-Install", price: 95, category: "Installations", extraNotes: "Includes braid down and styling - Extra 10 dollars for wig wash" },
  { name: "Closure Re-Install", price: 85, category: "Installations", extraNotes: "Includes braid down and styling - Extra 10 dollars for wig wash" },
  { name: "Traditional Leave-Out Sew-In", price: 130, category: "Sew-ins", extraNotes: "Includes braid down and styling " },
  { name: "Closure Sew-In", price: 140, category: "Sew-ins", extraNotes: "Includes braid down, customization, and styling " },
  { name: "Frontal Sew-In", price: 160, category: "Sew-ins", extraNotes: "Includes braid down, customization, and styling " },
  { name: "Frontal Customization", price: 70, category: "Other Services", extraNotes: "N/A" },
  { name: "Closure Customization", price: 65, category: "Other Services", extraNotes: "N/A" },
  { name: "Wig Revamp and Style", price: 75, category: "Other Services", extraNotes: "N/A" },
  { name: "Wig Wash and Style", price: 55, category: "Other Services", extraNotes: "N/A" },
];

async function main() {
  const prisma = new PrismaClient();
  let created = 0;
  let skipped = 0;

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.service.create({ data: service });
    created++;
  }

  console.log(`Done. Created ${created}, skipped ${skipped} (already existed).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
