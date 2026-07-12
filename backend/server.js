const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const { sequelize } = require('./db');

dotenv.config();

const app = express();
const basePort = Number(process.env.APP_PORT || 3000);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Assetflow backend is running' });
});

const listenPort = (port) => {
  const server = http.createServer(app);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying ${port + 1} instead.`);
      listenPort(port + 1);
    } else {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

const startServer = async (port) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    listenPort(port);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer(basePort);
