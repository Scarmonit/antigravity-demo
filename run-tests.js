import { execSync } from 'child_process';
import { join } from 'path';

try {
  console.log('Running all E2E tests...');
  const projectDir = 'c:\\Users\\scarm\\antigravity-demo';
  execSync('npx playwright test', {
    stdio: 'inherit',
    cwd: projectDir
  });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}
