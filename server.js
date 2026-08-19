const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize database
require('./backend/db/init');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', require('./backend/routes/projects'));
app.use('/api/boards', require('./backend/routes/boards'));
app.use('/api/tasks', require('./backend/routes/tasks'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Monday.com Clone API running on http://localhost:${PORT}`);
});
