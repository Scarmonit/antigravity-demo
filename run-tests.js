import { execSync } from 'child_process';
import { join } from 'path';

try {
  console.log('Running RAG Showcase tests...');
  const projectDir = 'c:\\Users\\scarm\\antigravity-demo';
  execSync('npx playwright test e2e/rag_showcase.spec.ts', {
    stdio: 'inherit',
    cwd: projectDir
  });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}
