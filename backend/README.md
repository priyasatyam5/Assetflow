# Assetflow Backend

## Prerequisites
- Node.js installed
- Either a local MySQL server or a hosted MySQL database
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
3. Create a `.env` file with either a connection URL or local credentials:
   ```env
   # Option 1: hosted database URL
   DATABASE_URL=mysql://username:password@host:3306/database_name
   DB_SSL=true

   # Option 2: local MySQL
   HOST=localhost
   USER=root
   PASSWORD=your_password
   DATABASE=assetflow
   PORT=3306
   ```

## Create tables
Run:
```bash
npm run db:sync
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
