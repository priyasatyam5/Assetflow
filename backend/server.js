const http = require('http');

const basePort = Number(process.env.PORT) || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Assetflow backend is running' }));
});

let currentPort = basePort;

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
