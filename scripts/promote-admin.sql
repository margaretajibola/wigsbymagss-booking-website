-- One-off: promote a user to admin by email.
-- Usage: paste the email below (already filled in for mags56@yahoo.com), then run:
--   DATABASE_URL="<production connection string>" npx prisma db execute --schema prisma/schema.prisma --stdin < scripts/promote-admin.sql
UPDATE "User" SET role = 'admin' WHERE email = 'mags56@yahoo.com';
