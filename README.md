# 🏢 Client & Compliance Portal — Backend API

[![Live Demo](https://img.shields.io/badge/Render-Live_API-brightgreen.svg)](https://client-portal-backend-ffa2.onrender.com)
[![Swagger Docs](https://img.shields.io/badge/Swagger-OpenAPI_3.0-blue.svg)](https://client-portal-backend-ffa2.onrender.com/api-docs)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose-brightgreen.svg)](https://www.mongodb.com/cloud/atlas)

> Enterprise-ready backend for the **Client & Compliance Portal**, built with **TypeScript**, **Express**, **MongoDB Atlas**, **Multi-Role JWT Authentication (RBAC)**, and interactive **Swagger API Docs**.

---

## 🌐 Live URLs

- **API Base URL:** [https://client-portal-backend-ffa2.onrender.com](https://client-portal-backend-ffa2.onrender.com)
- **Interactive Swagger Docs:** [https://client-portal-backend-ffa2.onrender.com/api-docs](https://client-portal-backend-ffa2.onrender.com/api-docs)

### API Health Check Response:
```json
{
  "success": true,
  "message": "Client & Compliance Portal Backend API is running.",
  "swaggerDocs": "https://client-portal-backend-ffa2.onrender.com/api-docs",
  "environment": "production"
}
```

---

## ⚡ How to Use this Backend (Quick Start)

### 1. Test via Interactive Swagger UI (No Postman required!)
1. Open the live Swagger UI: [https://client-portal-backend-ffa2.onrender.com/api-docs](https://client-portal-backend-ffa2.onrender.com/api-docs)
2. **Register or Login**:
   - For Clients: Execute `POST /api/auth/register-client`
   - For Staff/Admin: Execute `POST /api/auth/register-staff`
   - For Login: Execute `POST /api/auth/login`
3. **Authorize**:
   - Copy the `token` from the response.
   - Click the green **Authorize 🔓** button at the top right of the Swagger UI.
   - Enter your token: `Bearer <your_token>` and click **Authorize**.
4. **Test Protected Endpoints**:
   - Execute `GET /api/auth/me` to view current profile.
   - Execute `GET /api/auth/staff-dashboard` (Staff/Admin only).
   - Execute `GET /api/auth/admin-panel` (Admin only).

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Health check & link to Swagger docs |
| `POST` | `/api/auth/register-client` | Public | Registers Client & creates 1:1 business profile |
| `POST` | `/api/auth/register-staff` | Public / Admin | Registers Staff (`company`) or `admin` |
| `POST` | `/api/auth/login` | Public | Universal login returning JWT token & role |
| `GET` | `/api/auth/me` | Authenticated | Fetches current user & client profile data |
| `GET` | `/api/auth/staff-dashboard` | `company`, `admin` | Protected operational staff dashboard route |
| `GET` | `/api/auth/admin-panel` | `admin` | Protected administrative control panel route |

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/kamrul397/client-portal-backend.git
cd client-portal-backend
npm install
```

### 2. Environment Variables (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.dr5tu58.mongodb.net/client_compliance_portal?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_client_compliance_portal_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
Swagger UI will be live locally at `http://localhost:5000/api-docs`.

---

## 👨‍💻 Author
**Kamrul Islam**  
- GitHub: [@kamrul397](https://github.com/kamrul397)
