import { execSync } from 'child_process';

function run(cmd: string) {
  console.log(`🔧 Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const isCI = process.env.CI === 'true';

try {
  if (!isCI) {
    run('docker compose up -d');
  }

  run('npx prisma migrate deploy');
  run('npx prisma db seed');
  console.log('✅ Test DB ready');
} catch (err) {
  console.error('❌ Failed to prepare test DB', err);
  process.exit(1);
}
