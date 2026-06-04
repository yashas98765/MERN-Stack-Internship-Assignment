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

Deployment (Vercel + Render)

1) Deploy client to Vercel
- Go to https://vercel.com and import the GitHub repository `yashas98765/MERN-Stack-Internship-Assignment`.
- The repo includes a root `vercel.json` that builds the client app and rewrites all SPA routes.
- Set `VITE_API_URL` in Vercel to your deployed Render backend URL, for example `https://your-backend.onrender.com/api`.
- If you prefer manual settings, use build command `cd client && npm run build` and output directory `client/dist`.

2) Deploy server to Render
- Go to https://render.com, create a new Web Service, connect the GitHub repo and select the `main` branch.
- Build command: `npm install` — Start command: `npm start`.
- Add environment variables in Render Dashboard: `MONGO_URI` and `JWT_SECRET` (use a secure value).

After deployment
- Update the client to use the deployed server API URL via the `VITE_API_URL` environment variable on Vercel.

Screenshots & Demo

Create the following screenshots for submission:
- `screenshots/register.png` — registration page filled
- `screenshots/login.png` — login page
- `screenshots/dashboard-empty.png` — dashboard with no tasks
- `screenshots/dashboard-tasks.png` — dashboard showing tasks
- `screenshots/task-create.png` — create task modal/form
- `screenshots/task-edit.png` — edit task

To record a short demo (30–90s):
- Start the server and client locally as described above.
- Show: register → login → create task → toggle complete → edit → delete.
- Save video as `demo.mp4` and attach or upload to YouTube/Drive and include link in submission.


