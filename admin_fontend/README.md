Harari Admin Panel (React)

A minimal, enterprise-style React admin panel scaffold for a savings & credit management system. Includes JWT auth flow, admin-only route protection, pages for Dashboard, Users, Loan Approvals, Transactions, Reports, Audit Logs and Settings.

Quick start

1. Install dependencies:

```bash
cd admin_fontend
npm install
```

2. Create `.env` (see `.env.example`) and set `REACT_APP_API_URL` to your backend API, or leave blank to use the demo fallback.

3. Start the dev server:

```bash
npm start
```

Demo admin credentials (fallback/mock):
- Email: `admin@harari.test`
- Password: `Admin123!`

Notes
- This is a scaffold. Customize components, connect to your Node.js API backend, and extend business logic (loan eligibility, audit logs, etc.).
