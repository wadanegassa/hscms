# Harari Saving and Credit Management System (HCSMS)

A comprehensive web-based application designed to digitize and automate the operations of a saving and credit cooperative. HCSMS replaces manual, paper-based record-keeping with a centralized, secure, and efficient digital system.

## 🌟 Overview

The Harari Saving and Credit Management System aims to streamline the management of members, savings, loans, and repayments. By moving away from manual processes, the system ensures data accuracy, transparency, and operational efficiency for the organization.

### 🚩 Problem Statement
Manual systems often suffer from:
- **Data Redundancy & Errors:** Manual entries lead to mistakes and duplicate records.
- **Slow Processing:** Calculating interest, checking eligibility, and generating reports is time-consuming.
- **Lack of Transparency:** Members cannot easily check their balances or loan status.
- **Security Risks:** Physical files are vulnerable to loss, damage, or unauthorized access.

### 💡 The Solution
HCSMS solves these issues through:
- **Automation:** Instant calculation of interest and loan eligibility.
- **Centralized Database:** Secure storage in a single location to prevent duplicates.
- **Real-time Access:** Up-to-date information for both members and staff.
- **Security:** Robust digital authentication and role-based access control.

---

## 👥 User Roles & Responsibilities

The system caters to three primary user types:

### 1. Admin (System Administrator & Manager)
- Manage system settings and interest rates.
- Manage staff and users.
- Approve or reject loan requests.
- View comprehensive financial reports and audit logs.

### 2. Staff (Cashier/Officer)
- Register new members.
- Record daily savings deposits.
- Record loan repayments.
- Assist members with in-office transactions.

### 3. Member (Beneficiary)
- View personal profile and savings history.
- Check loan status.
- Apply for new loans online.

---

## 🚀 Key Functionalities

- **Member Registration:** Streamlined onboarding of new cooperative members.
- **Saving Deposit:** Quick recording and tracking of member savings.
- **Loan Management:** Complete lifecycle from application to eligibility checks, approval, and repayment tracking.
- **Eligibility Check:** Automated validation (e.g., `Requested Amount <= Total Savings * 3`).
- **Report Generation:** Instant summaries of total savings, active loans, and overdue payments.
- **Authentication & Authorization:** Secure JWT-based login and role-restricted access.

---

## 🛠 Tech Stack & Tools

HCSMS is built using the **MERN** stack for high performance and scalability.

- **Frontend:** [React.js](https://reactjs.org/) (Dynamic User Interface)
- **Backend:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (Robust API Logic)
- **Database:** [MongoDB](https://www.mongodb.com/) (NoSQL Data Storage via Mongoose)
- **State Management:** React Hooks & Context API
- **Styling:** Vanilla CSS / Tailwind CSS
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt for password hashing

---

## 📂 Project Structure

```text
ip_project/
├── admin_fontend/          # React App for Admin Panel
├── member_staff_frontend/   # React App (Vite) for Staff & Members
├── backend/                 # Node.js/Express API Server
└── README.md                # Project Documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ip_project
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your connection strings (PORT, MONGO_URI, JWT_SECRET)
   npm run dev
   ```

3. **Admin Frontend Setup:**
   ```bash
   cd ../admin_fontend
   npm install
   npm start
   ```

4. **Member/Staff Frontend Setup:**
   ```bash
   cd ../member_staff_frontend
   npm install
   npm run dev
   ```

---

## 🛡 Security Features
- **JWT Authentication:** Secure identity verification for all requests.
- **RBAC:** Role-Based Access Control ensuring users only see what they are authorized to.
- **Input Validation:** Server-side validation to prevent malicious data entry.
- **Password Hashing:** Industry-standard Bcrypt hashing for user credentials.
