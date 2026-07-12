const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const allocationRoutes = require('./routes/allocation');
const { transferRouter } = require('./routes/allocation');
const auditRoutes = require('./routes/audit');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notificationsRoute');
const allocationRoutes = require('./routes/allocation');

// New entities routes
const assetRoutes = require('./routes/assets');
const departmentRoutes = require('./routes/departments');
const userRoutes = require('./routes/users');
const maintenanceRoutes = require('./routes/maintenance');

// ✅ new audit routes
const auditCycleRoutes = require('./routes/auditCycles');
const auditLogRoutes = require('./routes/auditLogs');
const auditResultRoutes = require('./routes/auditResults');
const auditDiscrepancyRoutes = require('./routes/auditDiscrepancies');
const auditAuditorRoutes = require('./routes/auditAuditors');

const { sequelize } = require('./db');

dotenv.config();

const app = express();
const basePort = Number(process.env.APP_PORT || 3000);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// existing routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/transfer-requests', transferRouter);
app.use('/api/audit-cycles', auditRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance-requests', maintenanceRoutes);

// ✅ mount audit routes
app.use('/api/audit-cycles', auditCycleRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/audit-results', auditResultRoutes);
app.use('/api/audit-discrepancies', auditDiscrepancyRoutes);
app.use('/api/audit-auditors', auditAuditorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Assetflow backend is running' });
});

const startServer = async (port) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    global.dbConnected = true;
  } catch (error) {
    console.warn('Database connection unavailable, continuing without it:', error.message);
    global.dbConnected = false;
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
