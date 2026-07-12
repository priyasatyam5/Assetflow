# Assetflow

Assetflow is a lightweight asset management web application with a Node.js/Express backend and a Vite + React frontend. It provides asset inventory, allocation, auditing, maintenance, reporting, and user management features.

## Features
- Asset CRUD and categorization
- Allocations and transfers
- Audit cycles, auditors, results, and discrepancy tracking
- Maintenance request tracking
- Notifications and reporting endpoints
- Authentication with protected routes

## Repository structure

- `assetflow-schema.sql` — SQL schema for initial database setup
- `backend/` — Express backend
  - `server.js` — app entry point
  - `db.js` — database connection
  - `controllers/` — route controllers (assets, audits, users, etc.)
  - `models/` — Sequelize (or similar) model definitions
  - `routes/` — Express route definitions
  - `middleware/` — authentication and other middleware
- `frontend/` — Vite + React frontend
  - `src/` — React components, pages, services, and context
  - `index.html`, `vite.config.js`, `package.json`

## Prerequisites
- Node.js 16+ (recommended)
- npm or yarn
- PostgreSQL (or other DB configured in `backend/db.js`)

## Backend: setup & run

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment

- Create a `.env` file in `backend/` (example keys shown below):

```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/assetflow
JWT_SECRET=your_jwt_secret
```

3. Initialize database

- Run the SQL schema in `assetflow-schema.sql` against your database, or use your ORM migrations if available.

4. Start the server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend listens on the port configured in `PORT` (default `4000`).

## Frontend: setup & run

1. Install dependencies

```bash
cd frontend
npm install
```

2. Configure API base URL

- Update `frontend/src/services/apiClient.js` or set an environment variable like `VITE_API_BASE_URL` to point to the backend (e.g., `http://localhost:4000`).

3. Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173` (or the port Vite uses) in the browser.

## API overview

Key routes are defined under `backend/routes/`. Notable endpoints include:

- `POST /auth/login` — authenticate a user
- `GET /assets`, `POST /assets` — manage assets
- `POST /allocations` — create asset allocations
- Audit routes: `auditCycles`, `auditAuditors`, `auditResults`, `auditDiscrepancies`
- `GET /reports` — reporting endpoints

See route files under `backend/routes/` for the full list.

## Testing

- Backend: add tests under `backend/test` and run with your chosen test runner (e.g., `npm test`).
- Frontend: add tests under `frontend/src` and run with `npm test`.

## Development notes

- Controllers are in `backend/controllers/` and call model methods from `backend/models/`.
- Authentication middleware is in `backend/middleware/auth.js` and protects routes that require a logged-in user.
- Frontend uses React Context for auth state (`frontend/src/context/AuthContext.jsx`) and service modules under `frontend/src/services/` to call the API.

## Deploy

- Build the frontend via `npm run build` in `frontend/` and serve the static files from a CDN or from the backend static route.
- Use environment variables to configure production DB and JWT secrets.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description

