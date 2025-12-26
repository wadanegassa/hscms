# Harari Savings & Credit — Member/Staff Frontend

This is a React (Vite) frontend for the Harari Savings & Credit Management System. It provides role-based portals for staff and members, connects to an existing Node.js + MongoDB REST API, and follows a banking-style UI.

Quick start

1. Install dependencies

```bash
cd /home/pro/projects/ip_project/member_staff_frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Configure backend URL (optional)

Set `VITE_API_URL` in your environment or `.env` file, e.g.: `VITE_API_URL=http://localhost:4000/api`.

Notes
- Login expects `/auth/login` endpoint that returns `{ token, role, name }`.
- JWT stored in `localStorage` under `token`; user info stored under `user`.
- Protected routes redirect to `/unauthorized` if role mismatch.
