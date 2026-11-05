# 🏢 Client & Compliance Portal — Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v22.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose-brightgreen.svg)](https://www.mongodb.com/cloud/atlas)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-green.svg)](https://swagger.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

> Robust, production-ready enterprise backend architecture for the **Client & Compliance Portal**, built with **TypeScript**, **Express**, **MongoDB Atlas (Mongoose)**, **Multi-Role JWT Authentication (RBAC)**, and interactive **Swagger OpenAPI 3.0 Documentation**.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Database Schema (ERD Overview)](#-database-schema-erd-overview)
- [API Documentation (Swagger UI)](#-api-documentation-swagger-ui)
- [API Endpoints Summary](#-api-endpoints-summary)
- [Local Setup & Installation](#-local-setup--installation)
- [Deployment (Render / Cloud)](#-deployment-render--cloud)
- [Directory Structure](#-directory-structure)

---

## 🚀 Project Overview

The **Client & Compliance Portal** backend is designed to streamline corporate client management, regulatory compliance workflows, client service tracking, billing, and staff operations. 

This repository contains the core authentication engine and base infrastructure featuring a **Role-Based Access Control (RBAC)** system supporting three distinct roles:
1. **`client`**: External business clients requesting services, submitting compliance bills, and monitoring project milestones.
2. **`company`**: Internal company staff members assigned to handle client services, project deliverables, and communications.
3. **`admin`**: System administrators holding full operational privileges and staff governance.

---

## ✨ Key Features

- **Strict TypeScript Architecture**: Full static typing across controllers, middlewares, utilities, and Mongoose schemas (compiled targeting `ES2022` with `NodeNext`).
- **Cloud Database Integration**: Connected to **MongoDB Atlas** with automatic connection pooling, resilient retry timeouts, and strict schema validation.
- **Enterprise Multi-Role Auth**:
  - Secure password hashing using **`bcryptjs`** (10 salt rounds).
  - Cryptographically signed **JWT (JSON Web Tokens)** containing user ID, email, and role.
  - Granular RBAC middleware (`authenticate`, `authorizeRoles`).
- **Atomic 1:1 Client Profiles**: Automatically links new client registrations to an isolated `clientProfiles` collection tracking `businessName`, `panGstin`, `entityType`, and `kycStatus`.
- **Live Swagger Documentation**: Fully documented REST API with OpenAPI 3.0 specification, including an in-browser **JWT Bearer Token Authorize** tool for instant endpoint testing.

---

## 🛠️ Architecture & Tech Stack

| Technology | Purpose |
|---|---|
| **TypeScript (v5.8.2)** | Strongly typed programming language ensuring safety and maintainability |
| **Node.js (v22.x)** | Asynchronous event-driven JavaScript runtime |
| **Express.js (v5.x)** | High-performance, minimalist web server framework |
| **MongoDB Atlas / Mongoose** | Managed Cloud NoSQL database with Object Data Modeling (ODM) |
| **JWT (jsonwebtoken)** | Stateless token-based user authentication |
| **bcryptjs** | One-way hashing algorithm for password security |
| **Swagger UI / swagger-jsdoc** | OpenAPI 3.0 interactive API explorer and testing playground |
| **ts-node-dev** | Rapid development environment with zero-restart transpile mode |

---

## 🗄️ Database Schema (ERD Overview)

### 1. `users` Collection
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Auto PK | Unique identifier |
| `name` | `String` | Required, Trimmed | Full name of the user |
| `email` | `String` | Required, Unique, Lowercase | User email address |
| `password` | `String` | Hidden (`select: false`) | Bcrypt hashed password |
| `phone` | `String` | Optional, Trimmed | Contact number |
| `role` | `String` | Enum: `client`, `company`, `admin` | System permission role |
| `authProvider` | `String` | Default: `'local'` | Authentication source |
| `isActive` | `Boolean` | Default: `true` | Account active / suspended status |
| `createdAt` / `updatedAt` | `Date` | Managed by Mongoose | Timestamps |

### 2. `clientProfiles` Collection
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Auto PK | Unique identifier |
| `userId` | `ObjectId` | Required, Unique (`ref: User`) | 1:1 link to client user |
| `businessName` | `String` | Required, Trimmed | Registered enterprise entity name |
| `entityType` | `String` | Optional | e.g., Private Limited, LLP, Sole Proprietor |
| `panGstin` | `String` | Optional | Tax and compliance identification |
| `address` | `String` | Optional | Registered business address |
| `kycStatus` | `String` | Enum: `pending`, `submitted`, `verified`, `rejected` | Compliance verification state |

---

## 📄 API Documentation (Swagger UI)

Interactive documentation is available at:
```
http://localhost:5000/api-docs
```
*(Or your live deployment URL, e.g. `https://<your-render-url>.onrender.com/api-docs`)*

### Testing via Swagger:
1. Navigate to `/api/auth/register-client` or `/api/auth/login`.
2. Click **"Try it out"**, provide input, and click **"Execute"**.
3. Copy the returned `data.token`.
4. Click the green **Authorize 🔓** button at the top right of the Swagger UI.
5. Paste the token as `Bearer <token>` and click **Authorize**.
6. All protected routes (`/me`, `/staff-dashboard`, `/admin-panel`) can now be tested directly within the browser!

---

## 📡 API Endpoints Summary

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register-client` | Public | Register client account & optional `clientProfiles` |
| `POST` | `/api/auth/register-staff` | Public / Admin | Register company staff (`company`) or `admin` |
| `POST` | `/api/auth/login` | Public | Universal login returning JWT token & role |
| `GET` | `/api/auth/me` | Authenticated | Fetch authenticated user profile & business data |
| `GET` | `/api/auth/staff-dashboard` | `company`, `admin` | RBAC test route for operational staff |
| `GET` | `/api/auth/admin-panel` | `admin` | RBAC test route strictly for system administrators |

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/kamrul397/client-portal-backend.git
cd client-portal-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.dr5tu58.mongodb.net/client_compliance_portal?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Production build & run
```bash
npm run build
npm start
```

---

## ☁️ Deployment (Render / Cloud)

To deploy on [Render](https://render.com):
1. **Connect Repo**: Select `kamrul397/client-portal-backend`.
2. **Runtime**: Node
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`.

---

## 📂 Directory Structure

```text
client-portal-backend/
├── src/
│   ├── config/
│   │   ├── db.ts               # MongoDB Atlas connection handler
│   │   └── swagger.ts          # OpenAPI 3.0 specification & Swagger setup
│   ├── controllers/
│   │   └── authController.ts   # Registration, login, profile logic
│   ├── middlewares/
│   │   └── auth.ts             # JWT verification & RBAC authorization
│   ├── models/
│   │   ├── User.ts             # User schema with roles (client, company, admin)
│   │   └── ClientProfile.ts    # 1:1 Client business & KYC profile schema
│   ├── routes/
│   │   └── authRoutes.ts       # Express router with Swagger JSDoc comments
│   ├── utils/
│   │   └── jwt.ts              # Token sign and verify utilities
│   └── server.ts               # Server bootstrapping, middlewares, listeners
├── .env                        # Local environment variables (git-ignored)
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Project documentation
```

---

## 👨‍💻 Author
**Kamrul Islam**  
- GitHub: [@kamrul397](https://github.com/kamrul397)
