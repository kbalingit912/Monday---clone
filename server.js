const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize database
try {
  require('./backend/db/init');
  console.log('Database initialized');
} catch (error) {
  console.error('Failed to initialize database:', error);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Routes
try {
  app.use('/api/projects', require('./backend/routes/projects'));
  app.use('/api/boards', require('./backend/routes/boards'));
  app.use('/api/tasks', require('./backend/routes/tasks'));
  app.use('/api/trading-trades', require('./backend/routes/trading-trades'));
} catch (error) {
  console.error('Error loading routes:', error);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve React app for all other routes (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);

app.listen(PORT, () => {
  console.log(`✅ Smart Schedule running on port ${PORT}`);
});
