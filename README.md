# 🔐 Secure Authentication API (Node.js + Express + MongoDB)

This project is a **secure backend authentication system** built using **Node.js, Express, and MongoDB**.  
It demonstrates **real-world backend development practices** including authentication, authorization, security, validation, logging, and documentation.

This is a **production-style backend project**, not just a basic demo.

---

## 🚀 Features

- User Registration & Login
- Password Hashing using bcrypt
- JWT-based Authentication
- Role-Based Access Control (User / Admin)
- Protected Routes
- Rate Limiting (Prevents brute-force attacks)
- Input Validation
- Secure HTTP Headers (Helmet)
- Centralized Error Handling
- Request & Error Logging
- Swagger API Documentation
- Postman Collection for API Testing

---

## 🛠️ Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – MongoDB ODM
- **JWT (JSON Web Token)** – Authentication
- **bcrypt** – Password hashing
- **Helmet** – Secure HTTP headers
- **express-rate-limit** – Rate limiting
- **express-validator** – Input validation
- **Swagger** – API documentation
- **Postman** – API testing

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd auth-api
2️⃣ Install dependencies
bash
npm install
3️⃣ Create .env file
env
MONGO_URI=mongodb://127.0.0.1:27017/authDB
JWT_SECRET=your_secret_key
4️⃣ Start the server
bash
node server.js
Server will start at:
http://localhost:3000
🔑 API Endpoints
Authentication
POST /api/register – Register a new user

POST /api/login – Login and receive JWT token

Protected Routes
GET /api/profile – Accessible only by users

GET /api/admin – Accessible only by admins

🔐 Authentication & Authorization Flow
User registers with email and password

Password is hashed before storing in database

User logs in with credentials

Server verifies password

JWT token is generated

Client sends token in Authorization header

Middleware validates token

Role middleware checks permissions

Access is granted or denied

🧪 API Testing
Swagger Documentation
Swagger provides live API documentation and testing.

Open in browser:

http://localhost:3000/api-docs
Features:

View all APIs

See request/response structure

Test APIs directly

JWT authorization support

Postman Collection
All APIs are tested using Postman

Login API automatically saves JWT token

Protected APIs reuse token using environment variables

Collection can be exported and shared

🛡️ Security Features Explained
bcrypt ensures passwords are never stored in plain text

JWT enables stateless authentication

Role-based access restricts API access

Rate limiting prevents brute-force attacks

Helmet secures HTTP headers

Input validation prevents malformed requests

Error handling middleware prevents server crashes

Logging system helps debug and monitor requests

📝 Logging & Error Handling
All incoming requests are logged

Login attempts are logged

Errors are handled centrally

Clean error messages are returned to clients

🎯 Learning Outcome
This project helped me understand:

How authentication works end-to-end

How JWT-based security is implemented

How middleware works in Express

How to design secure backend APIs

How to structure backend projects cleanly

How production-ready backend systems are built
