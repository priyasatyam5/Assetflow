# Assetflow Backend

## Prerequisites
- Node.js installed
- MySQL server running
- A MySQL database created (for example, `assetflow`)

## Setup
1. Open the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the environment variables in `.env`:
   ```env
   HOST=localhost
   USER=root
   PASSWORD=your_password
   DATABASE=assetflow
   PORT=3306
   ```

## Run the backend
Start the server:
```bash
npm start
```

## Run a database test query
You can test the MySQL connection with:
```bash
node example-query.js
```

## Notes
- Keep your `.env` file private and do not commit real credentials.
- If port `3000` is already in use, the server will try the next available port.
