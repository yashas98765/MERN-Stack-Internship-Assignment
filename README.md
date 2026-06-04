# MERN Task Management App

This is a simple MERN stack Task Management application built for the internship assignment.

Summary
- User registration and login
- Create, update, delete, and view tasks
- Mark tasks as completed or pending

Features:
- User registration and login (JWT)
- Create, update, delete, view tasks
- Toggle task status (pending / completed)
- Search & pagination-ready API

Requirements:
- Node.js (16+ recommended)
- MongoDB running locally or a connection string

Setup
1. Server

```powershell
cd C:/Users/Yashas/mern-task/server
npm install
copy .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm run dev
```

2. Client

```powershell
cd C:/Users/Yashas/mern-task/client
npm install
npm run dev
```

Open http://localhost:5173 (Vite) for client and ensure server runs at http://localhost:5000

Notes
- The client expects the API at `http://localhost:5000/api`.
- To prepare submission: zip the project folder or push to GitHub.

