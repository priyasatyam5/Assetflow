const { sequelize } = require('./db');

async function main() {
  try {
    await sequelize.authenticate();
    const [rows] = await sequelize.query('SELECT NOW() AS currentTime');
    console.log('Query result:', rows[0]);
  } catch (error) {
    console.error('Database query failed:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
