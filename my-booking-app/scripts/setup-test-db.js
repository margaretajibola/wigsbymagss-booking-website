// scripts/setup-test-db.js
import { execSync } from 'child_process';

async function setupTestDatabase() {
  try {
    console.log('Setting up test database...');
    
    // Create test database
    execSync('createdb wbm_booking_app_test', { stdio: 'inherit' });
    console.log('✅ Test database created');
    
    // Run migrations
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'postgresql://magss:5TvCTH4jgtbwFC8jxyAv@localhost:5432/wbm_booking_app_test' }
    });
    console.log('✅ Migrations applied');
    
  } catch (error) {
    console.error('❌ Test database setup failed:', error.message);
    process.exit(1);
  }
}

setupTestDatabase();