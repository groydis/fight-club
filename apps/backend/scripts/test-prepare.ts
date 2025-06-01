import { execSync } from 'node:child_process';
import path from 'node:path';

const run = (cmd: string, options = {}) => {
  console.log(`🔧 Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...options });
};

try {
  // 1. Start DB container if not already running
  run('docker compose up -d');

  // 2. Run Prisma migrations
  run('npx prisma migrate deploy');

  // 3. Seed the database
  const seedPath = path.resolve(__dirname, '../prisma/seed.ts');
  run(`ts-node ${seedPath}`);

  console.log('✅ Test DB prepared');
} catch (err) {
  console.error('❌ Failed to prepare test DB', err);
  process.exit(1);
}
