# Harari Saving & Credit Management System - Backend

Node.js + Express + MongoDB backend implementing role-based auth, loans, savings, repayments, goals, notifications and audit logs.

Quick start

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server:

```bash
npm run dev
```

Seed admin

By default `.env.example` includes `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. On first startup a seed admin user will be created.

Using MongoDB Atlas

1. Create a cluster in Atlas and a database user with password.
2. In your local project copy `.env.example` to `.env` and set `MONGO_URI` to the Atlas connection string. Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/harari_savings?retryWrites=true&w=majority
```

3. Make sure your network/IP access is configured in Atlas to allow your machine.

Then start the server as shown above.

API

Base path: `/api`

- `POST /api/auth/login` — login
- `POST /api/auth/register` — admin only: create staff/member

Role routes are under `/api/admin`, `/api/staff`, `/api/member` and `/api/notifications`.

Notes

- This project is a scaffold to demonstrate required backend behavior. It is suitable to extend with validation, tests, pagination, and production-ready logging.
