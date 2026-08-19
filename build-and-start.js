const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'frontend/dist');

// If dist doesn't exist, build it
if (!fs.existsSync(distPath)) {
  console.log('Building frontend...');
  try {
    execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
    console.log('Frontend build complete');
  } catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
  }
}

// Start the server
require('./server.js');
