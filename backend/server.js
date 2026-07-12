const http = require('http');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Import your dashboard routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Fallback route (your original message)
app.get('/', (req, res) => {
  res.json({ message: 'Assetflow backend is running' });
});

const basePort = Number(process.env.APP_PORT || 3000);
let currentPort = basePort;

const server = http.createServer(app);

const startServer = (port) => {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    currentPort += 1;
    console.warn(`Port ${currentPort - 1} is busy. Trying ${currentPort} instead.`);
    startServer(currentPort);
  } else {
    throw error;
  }
});

startServer(currentPort);
