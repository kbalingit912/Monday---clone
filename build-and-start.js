const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'frontend/dist');
const indexPath = path.join(distPath, 'index.html');

// If dist/index.html doesn't exist, build it
if (!fs.existsSync(indexPath)) {
  console.log('Building frontend...');

  // Run npm install in frontend
  console.log('Installing frontend dependencies...');
  const installResult = spawnSync('npm', ['install'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  if (installResult.error || installResult.status !== 0) {
    console.error('npm install failed');
    process.exit(1);
  }

  // Run npm run build in frontend
  console.log('Running build...');
  const buildResult = spawnSync('npm', ['run', 'build'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  if (buildResult.error || buildResult.status !== 0) {
    console.error('npm run build failed');
    process.exit(1);
  }

  console.log('Frontend build complete');
}

console.log('Starting server...');
require('./server.js');
