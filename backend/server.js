const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const allocationRoutes = require('./routes/allocation'); 
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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/allocations', allocationRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Assetflow backend is running' });
});

const startServer = async (port) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
  } catch (error) {
    console.warn('Database connection unavailable, continuing without it:', error.message);
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port === basePort) {
      console.warn(`Port ${port} is busy, trying ${port + 1} instead.`);
      server.close(() => startServer(port + 1));
      return;
    }

    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
};

startServer(basePort);
