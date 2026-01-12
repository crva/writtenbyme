# WrittenByMe

🎉 **Full-Stack Article Writing Platform**

Simple web app to create, edit, and share articles with a modern UI and reliable backend.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- Docker & Docker Compose
- npm or yarn

### 1️⃣ Start Database

```bash
docker-compose up -d
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Backend: http://localhost:3001

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

### 4️⃣ Test It Out

1. Open http://localhost:5173
2. Click "Sign in / Register"
3. Create an account
4. Start writing! ✍️

---

## 🏗️ Architecture

```
Frontend (React + Zustand)
    ↓
API Client (Generic fetch wrapper)
    ↓
Backend (Express + Auth.js)
    ↓
Database (PostgreSQL)
```

---
