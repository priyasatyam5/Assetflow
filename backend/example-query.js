const pool = require('./db');

async function main() {
  try {
    const [rows] = await pool.execute('SELECT NOW() AS currentTime');
    console.log('Query result:', rows[0]);
  } catch (error) {
    console.error('Database query failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
