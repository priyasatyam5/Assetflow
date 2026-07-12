const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
<<<<<<< HEAD
const express = require('express');
=======
const authRoutes = require('./routes/auth');
const { sequelize } = require('./db');
>>>>>>> 09f87ec16b88df6a224d59138282bbf6aebbf819

dotenv.config();

const app = express();
<<<<<<< HEAD
app.use(express.json());

// ✅ Import your dashboard routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Fallback route (your original message)
=======
const basePort = Number(process.env.APP_PORT || 3000);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);

>>>>>>> 09f87ec16b88df6a224d59138282bbf6aebbf819
app.get('/', (req, res) => {
  res.json({ message: 'Assetflow backend is running' });
});

<<<<<<< HEAD
const basePort = Number(process.env.APP_PORT || 3000);
let currentPort = basePort;

const server = http.createServer(app);

const startServer = (port) => {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
=======
const startServer = async (port) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
>>>>>>> 09f87ec16b88df6a224d59138282bbf6aebbf819
};

startServer(basePort);
